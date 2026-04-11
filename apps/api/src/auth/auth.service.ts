import {
  Injectable,
  BadRequestException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthProvider } from '../common/enums/auth-provider.enum';
import {
  EMAIL_PASSWORD_RESET,
  EMAIL_WELCOME,
  EMAIL_WELCOME_WITH_VERIFICATION,
  NO_REPLY_EMAIL
} from '../common/constants';
import { MailService } from '../mail/mail.service';
import { EnvironmentService } from '../environments/environment.service';
import { truncEmail, truncToken } from '../common/utils/strings';
import { UserRole } from '../users/users.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvironmentService,
    private readonly mailService: MailService
  ) {}

  async validateUser(email: string, password: string) {
    this.logger.debug(`Validating credentials for user: ${truncEmail(email)}`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.debug(
        `Authentication failed: user not found - ${truncEmail(email)}`
      );
      return null;
    }

    if (user.provider !== AuthProvider.EMAIL) {
      this.logger.debug(
        `Authentication failed: User with email:${truncEmail(email)} is not registered as email provider`
      );
      return null;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (passwordValid) {
      this.logger.debug(
        `Authentication successful for user: ${truncEmail(email)}`
      );
      return user;
    } else {
      this.logger.debug(
        `Authentication failed: invalid password for user - ${truncEmail(email)}`
      );
      return null;
    }
  }

  async signup(
    name: string,
    email: string,
    password: string,
    isAgent: boolean
  ) {
    this.logger.log(`Creating new user account: ${truncEmail(email)}`);

    try {
      const user = await this.usersService.create(
        name,
        email,
        password,
        isAgent ? UserRole.AGENT : UserRole.NORMAL,
        AuthProvider.EMAIL
      );

      this.logger.log(
        `User account created successfully: ${truncEmail(email)} (ID: ${user._id})`
      );

      if (!user.emailVerified) {
        this.logger.debug(
          `Sending verification email to: ${truncEmail(email)}`
        );
        const verificationUrl = `${this.envService.frontendWebUrl()}/auth/verify-email?vtoken=${user.emailVToken}`;

        await this.mailService.sendEmail({
          from: NO_REPLY_EMAIL,
          to: user.email,
          templateId: EMAIL_WELCOME_WITH_VERIFICATION,
          templateData: {
            verificationUrl
          }
        });
        this.logger.debug(`Verification email sent to: ${truncEmail(email)}`);
      }

      await this.usersService.updateLastLogin(user._id, AuthProvider.EMAIL);

      const payload = { sub: user._id };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      this.logger.warn(
        `Failed to create user account: ${truncEmail(email)}`,
        (error as { stack: any }).stack
      );
      throw error;
    }
  }

  async verifyEmail(vtoken: string): Promise<boolean> {
    this.logger.debug(`Verifying email with token: ${truncToken(vtoken)}`);
    const result = await this.usersService.verifyEmail(vtoken);

    if (result) {
      this.logger.debug(
        `Email verification successful for token: ${truncToken(vtoken)}`
      );
    } else {
      this.logger.debug(
        `Email verification failed for token: ${truncToken(vtoken)}`
      );
    }

    return result;
  }

  async login(user: { email: string; id: string }) {
    this.logger.debug(
      `Generating auth token for user: ${truncEmail(user.email)} (ID: ${user.id})`
    );

    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.debug(
      `Updating last login for user: ${truncEmail(user.email)}`
    );
    await this.usersService.updateLastLogin(user.id, AuthProvider.EMAIL);

    return { accessToken };
  }

  async loginGoogle(user: {
    email: string;
    name: string;
    googleId: string;
    profileImg: string;
  }) {
    const { email, name, googleId, profileImg } = user;
    this.logger.log(
      `[loginGoogle()] Processing Google OAuth login for: ${truncEmail(email)}`
    );

    const existingUser = await this.usersService.findByEmail(email);
    let finalUser = existingUser;

    if (existingUser) {
      this.logger.debug(
        `[loginGoogle()] Existing user found for Google OAuth: ${truncEmail(email)}`
      );

      if (!existingUser.googleId) {
        this.logger.debug(
          `[loginGoogle()] Linking Google account to existing user: ${truncEmail(email)}`
        );
        await this.usersService.linkGoogleId(existingUser._id, googleId);
      }
    } else {
      this.logger.debug(
        `[loginGoogle()] Creating new user from Google OAuth: ${truncEmail(email)}`
      );

      finalUser = await this.usersService.create(
        name,
        email,
        '',
        UserRole.NORMAL,
        AuthProvider.GOOGLE,
        profileImg,
        googleId
      );

      this.logger.debug(
        `[loginGoogle()] Sending welcome email to: ${truncEmail(email)}`
      );

      await this.mailService.sendEmail({
        from: NO_REPLY_EMAIL,
        to: user.email,
        templateId: EMAIL_WELCOME,
        templateData: {}
      });
    }

    if (!finalUser) {
      throw new UnauthorizedException(
        'Failed to authenticate user with Google account'
      );
    }

    const userId = finalUser._id;
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.debug(
      `[loginGoogle()] Updating last login for user: ${truncEmail(email)}`
    );
    await this.usersService.updateLastLogin(userId, AuthProvider.GOOGLE);

    this.logger.log(
      `[loginGoogle()] Google OAuth login successful for: ${truncEmail(email)}`
    );
    return { accessToken };
  }

  async linkGoogleAccount(oauthUser: { email: string; googleId: string }) {
    const { email, googleId } = oauthUser;
    this.logger.log(
      `[linkGoogleAccount()] Processing Google account linking for: ${truncEmail(email)}`
    );

    // Find existing user by email (should exist since this is linking mode)
    const existingUser = await this.usersService.findByEmail(email);

    if (!existingUser) {
      this.logger.error(
        `[linkGoogleAccount()] Google account linking failed: User not found for email: ${truncEmail(email)}`
      );
      throw new BadRequestException('User account not found');
    }

    // Check if Google account is already linked
    if (existingUser.googleId) {
      this.logger.error(
        `[linkGoogleAccount()] Google account linking failed: Account already linked for user: ${truncEmail(email)}`
      );
      throw new BadRequestException(
        'Google account is already linked to this user'
      );
    }

    // Link the Google account
    this.logger.debug(
      `[linkGoogleAccount()] Linking Google account to user: ${truncEmail(email)}`
    );
    await this.usersService.linkGoogleId(existingUser._id, googleId);

    // Generate new access token for the user
    const userId = existingUser._id;
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(
      `[linkGoogleAccount()] Google account linking successful for: ${truncEmail(email)}`
    );
    return { accessToken };
  }

  async linkFacebookAccount(oauthUser: { email: string; facebookId: string }) {
    const { email, facebookId } = oauthUser;
    this.logger.log(
      `[linkFacebookAccount()] Processing Facebook account linking for: ${truncEmail(email)}`
    );

    // Find existing user by email (should exist since this is linking mode)
    const existingUser = await this.usersService.findByEmail(email);

    if (!existingUser) {
      this.logger.error(
        `[linkFacebookAccount()] Facebook account linking failed: User not found for email: ${truncEmail(email)}`
      );
      throw new BadRequestException('User account not found');
    }

    // Check if Facebook account is already linked
    if (existingUser.facebookId) {
      this.logger.error(
        `[linkFacebookAccount()] Facebook account linking failed: Account already linked for user: ${truncEmail(email)}`
      );
      throw new BadRequestException(
        'Facebook account is already linked to this user'
      );
    }

    // Link the Facebook account
    this.logger.debug(
      `[linkFacebookAccount()] Linking Facebook account to user: ${truncEmail(email)}`
    );

    await this.usersService.linkFacebookId(existingUser._id, facebookId);

    // Generate new access token for the user
    const userId = existingUser._id;
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(
      `[linkFacebookAccount()] Facebook account linking successful for: ${truncEmail(email)}`
    );

    return { accessToken };
  }

  async loginFacebook(user: {
    email: string;
    name: string;
    facebookId: string;
    profileImg: string;
  }) {
    const { email, name, facebookId, profileImg } = user;
    this.logger.log(
      `[loginFacebook()] Processing Facebook OAuth login for: ${truncEmail(email)}`
    );

    const existingUser = await this.usersService.findByEmail(email);
    let finalUser = existingUser;

    if (existingUser) {
      this.logger.debug(
        `[loginFacebook()] Existing user found for Facebook OAuth: ${truncEmail(email)}`
      );

      if (!existingUser.facebookId) {
        this.logger.debug(
          `[loginFacebook()] Linking Facebook account to existing user: ${truncEmail(email)}`
        );
        await this.usersService.linkFacebookId(existingUser._id, facebookId);
      }
    } else {
      this.logger.debug(
        `[loginFacebook()] Creating new user from Facebook OAuth: ${truncEmail(email)}`
      );

      finalUser = await this.usersService.create(
        name,
        email,
        '',
        UserRole.NORMAL,
        AuthProvider.FACEBOOK,
        profileImg,
        undefined,
        facebookId
      );

      this.logger.debug(
        `[loginFacebook()] Sending welcome email to: ${truncEmail(email)}`
      );

      await this.mailService.sendEmail({
        from: NO_REPLY_EMAIL,
        to: user.email,
        templateId: EMAIL_WELCOME,
        templateData: {}
      });
    }

    if (!finalUser) {
      throw new UnauthorizedException(
        'Failed to authenticate user with Facebook account'
      );
    }

    const userId = finalUser._id;
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.debug(
      `[loginFacebook()] Updating last login for user: ${truncEmail(email)}`
    );
    await this.usersService.updateLastLogin(userId, AuthProvider.FACEBOOK);

    this.logger.log(
      `[loginFacebook()] Facebook OAuth login successful for: ${truncEmail(email)}`
    );

    return { accessToken };
  }

  async profile(userId: string): Promise<any> {
    this.logger.debug(`Retrieving profile for user ID: ${userId}`);
    const user = await this.usersService.findByIdForProfile(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async sendPasswordResetEmail(email: string) {
    this.logger.log(`Password reset requested for email: ${truncEmail(email)}`);

    const user = await this.usersService.findByEmail(email);
    const message = 'If the email exists, a password reset link has been sent';
    if (!user) {
      return { message };
    }

    if (user.provider !== AuthProvider.EMAIL) {
      const providerName =
        user.provider === AuthProvider.GOOGLE ? 'Google' : 'Facebook';
      return {
        message: `This account was registered with ${providerName}`
      };
    }

    const resetToken = await this.usersService.createPasswordResetToken(email);

    if (!resetToken) {
      return { message };
    }

    const resetUrl = `${this.envService.frontendWebUrl()}/auth/reset-password?token=${resetToken}`;
    this.logger.log(
      `Password reset token generated for email: ${truncEmail(email)}`
    );

    await this.mailService.sendEmail({
      from: NO_REPLY_EMAIL,
      to: email,
      templateId: EMAIL_PASSWORD_RESET,
      templateData: {
        resetUrl
      }
    });

    return { message };
  }

  async validateResetToken(token: string) {
    this.logger.log(`Validating reset token: ${truncToken(token)}`);
    const isValid = await this.usersService.validateResetToken(token);

    if (!isValid) {
      this.logger.warn(`Reset token validation failed: ${truncToken(token)}`);
      throw new BadRequestException('Invalid or expired reset token');
    }

    this.logger.log(`Reset token validation successful: ${truncToken(token)}`);
    return { message: 'Reset token is valid' };
  }

  async resetPassword(token: string, newPassword: string) {
    this.logger.log(`Password reset attempt with token: ${truncToken(token)}`);
    const success = await this.usersService.resetPassword(token, newPassword);

    if (!success) {
      this.logger.warn(
        `Password reset failed: Invalid or expired token ${truncToken(token)}`
      );
      throw new BadRequestException('Invalid or expired reset token');
    }

    this.logger.log(
      `Password reset successful for token: ${truncToken(token)}`
    );
    return { message: 'Password has been reset successfully' };
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    this.logger.log(`Password update attempt for user: ${userId}`);

    try {
      const success = await this.usersService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );

      if (success) {
        this.logger.log(`Password updated successfully for user: ${userId}`);
        return { message: 'Password has been updated successfully' };
      } else {
        this.logger.warn(`Password update failed for user: ${userId}`);
        throw new BadRequestException('Failed to update password');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to update password');
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto
  ): Promise<any> {
    this.logger.log(`Profile update attempt for user: ${userId}`);

    try {
      const updatedUser = await this.usersService.updateProfile(
        userId,
        updateProfileDto
      );

      if (!updatedUser) {
        this.logger.warn(
          `Profile update failed: user not found for ID: ${userId}`
        );
        throw new BadRequestException('User not found');
      }

      this.logger.log(`Profile updated successfully for user: ${userId}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Profile update failed for user: ${userId}`, error);
      throw new BadRequestException('Failed to update profile');
    }
  }
}
