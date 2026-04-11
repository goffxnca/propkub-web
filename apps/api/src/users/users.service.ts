import {
  Injectable,
  OnModuleInit,
  ConflictException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as usersData from './data/users.json';
import { User, UserDocument, UserRole } from './users.schema';
import { v4 as uuidV4 } from 'uuid';
import { AuthProvider } from '../common/enums/auth-provider.enum';
import { EnvironmentService } from '../environments/environment.service';
import { generatePassword } from '../common/utils/strings';
import * as bcrypt from 'bcrypt';
import { USER_SAFE_PROJECTION } from './constants/user-security.constants';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly envService: EnvironmentService
  ) {}

  async onModuleInit() {
    if (this.envService.isTest()) {
      return;
    }

    const count = await this.userModel.estimatedDocumentCount();
    if (count === 0) {
      const transformedUsers = await Promise.all(
        (usersData as unknown as User[]).map(async (user, index) => {
          const tempIntialPassword = generatePassword();
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(tempIntialPassword, salt);
          const userId = (user as any).id;
          return {
            ...user,
            cid: index + 1,
            name: user?.name || 'null',
            ___id: userId,
            password: hashedPassword,
            temp_p: tempIntialPassword,
            provider: AuthProvider.EMAIL,
            role: UserRole.NORMAL,
            emailVToken:
              user.emailVerified === true ? undefined : user.emailVToken,
            createdAt: new Date(
              (user.createdAt as any).seconds * 1000 +
                (user.createdAt as any).nanoseconds / 1000000
            ),
            createdBy: undefined,
            updatedAt: undefined,
            updatedBy: undefined,
            tos: true
          };
        })
      );

      await this.userModel.insertMany(transformedUsers);

      // Update createdBy to the user's id for all users
      const users = await this.userModel.find({}, '_id');
      const operations = users.map((user) => ({
        updateOne: {
          filter: { _id: user._id },
          update: { createdBy: user._id }
        }
      }));
      await this.userModel.bulkWrite(operations);

      console.log(`✅ Seeded ${transformedUsers.length} users.`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Finding user by email: ${email}`);
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string) {
    this.logger.debug(`Finding user by ID: ${userId}`);
    return await this.userModel.findById(userId);
  }

  async findByIdForProfile(userId: string) {
    this.logger.debug(`Finding user profile by ID: ${userId}`);
    return await this.userModel.findById(userId, USER_SAFE_PROJECTION);
  }

  async create(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    provider: AuthProvider,
    profileImg?: string,
    googleId?: string,
    facebookId?: string
  ): Promise<User> {
    this.logger.debug(
      `Creating new user with email: ${email}, provider: ${provider}`
    );

    const user = await this.findByEmail(email);
    if (user) {
      this.logger.warn(`Email already exists - ${email}`);
      throw new ConflictException('Email already registered');
    }

    const newUser = new this.userModel({
      name,
      email,
      password: provider === AuthProvider.EMAIL ? password : undefined,
      provider,
      role,
      tos: true,
      profileImg,
      emailVerified: provider !== AuthProvider.EMAIL,
      emailVToken: provider === AuthProvider.EMAIL ? uuidV4() : undefined,
      googleId,
      facebookId,
      createdAt: new Date()
    });

    const savedUser = await newUser.save();
    this.logger.log(
      `User created successfully: ${email} (ID: ${savedUser._id})`
    );
    return savedUser;
  }

  async updateLastLogin(userId: string, provider: AuthProvider) {
    this.logger.debug(
      `Updating last login for user: ${userId}, provider: ${provider}`
    );
    await this.userModel.findByIdAndUpdate(userId, {
      lastLoginProvider: provider,
      lastLoginAt: new Date()
    });
  }

  async linkGoogleId(userId: string, googleId: string) {
    this.logger.debug(`[linkGoogleId()] Linking Google ID for user: ${userId}`);
    await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        googleId,
        emailVerified: true
      },
      $unset: {
        emailVToken: 1
      }
    });
  }

  async linkFacebookId(userId: string, facebookId: string) {
    this.logger.debug(`Linking Facebook ID for user: ${userId}`);
    await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        facebookId,
        emailVerified: true
      },
      $unset: {
        emailVToken: 1
      }
    });
  }

  async verifyEmail(vtoken: string): Promise<boolean> {
    this.logger.debug(
      `Verifying email with token: ${vtoken.substring(0, 8)}...`
    );

    const user = await this.userModel.findOne({
      emailVToken: vtoken
    });

    if (!user) {
      this.logger.warn(
        `Email verification failed: token not found - ${vtoken.substring(0, 8)}...`
      );
      return false;
    }

    if (user.emailVerified) {
      this.logger.warn(
        `Email verification failed: email already verified - User: ${user._id}`
      );
      return false;
    }

    user.emailVerified = true;
    user.emailVToken = undefined;

    user.updatedAt = new Date();
    user.updatedBy = user._id;

    await user.save();
    this.logger.log(`Email verified successfully for user: ${user._id}`);
    return true;
  }

  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      this.logger.warn(
        `Password reset token requested for non-existent email: ${email}`
      );
      return null;
    }

    const resetToken = uuidV4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    await this.userModel.updateOne(
      { _id: user._id },
      {
        passwordReset: {
          token: resetToken,
          expires: expires
        },
        updatedAt: new Date()
      }
    );

    this.logger.log(`Password reset token created for user: ${user._id}`);
    return resetToken;
  }

  async validateResetToken(token: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      'passwordReset.token': token,
      'passwordReset.expires': { $gt: new Date() }
    });

    return !!user;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      'passwordReset.token': token,
      'passwordReset.expires': { $gt: new Date() }
    });

    if (!user) {
      this.logger.warn(`Password reset failed: invalid or expired token`);
      return false;
    }

    user.password = newPassword;
    user.temp_p = undefined;
    user.passwordReset = undefined;
    user.updatedAt = new Date();

    await user.save();
    this.logger.log(`Password updated successfully for user: ${user._id}`);
    return true;
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      this.logger.warn(`Update password failed: user not found`);
      return false;
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      this.logger.warn(
        `Update password failed: invalid current password for user ${userId}`
      );
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = newPassword;
    user.temp_p = undefined;
    user.updatedAt = new Date();
    user.updatedBy = userId;

    await user.save();
    this.logger.log(`Password updated successfully for user: ${user._id}`);
    return true;
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto
  ): Promise<User | null> {
    this.logger.debug(`Updating profile for user: ${userId}`);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
            updatedBy: userId
          }
        },
        {
          new: true,
          select: USER_SAFE_PROJECTION
        }
      )
      .exec();

    if (updatedUser) {
      this.logger.log(`Profile updated successfully for user: ${userId}`);
    }

    return updatedUser;
  }
}
