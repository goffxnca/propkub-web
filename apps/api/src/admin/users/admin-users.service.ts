import { Injectable, ConflictException } from '@nestjs/common';
import { User, UserDocument } from '../../users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthProvider } from '../../common/enums/auth-provider.enum';
import { MailService } from '../../mail/mail.service';
import {
  USER_SAFE_PROJECTION,
  USER_SAFE_SELECT
} from '../../users/constants/user-security.constants';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService
  ) {}

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    const query = this.userModel.find({}, USER_SAFE_PROJECTION);

    if (offset) {
      query.skip(offset);
    }

    if (limit) {
      query.limit(limit);
    }

    return query.exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id, USER_SAFE_PROJECTION).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }, USER_SAFE_PROJECTION).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.email) {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`
        );
      }
    }

    const userData = {
      ...createUserDto,
      provider: AuthProvider.EMAIL,
      createdBy: 'admin',
      createdAt: new Date()
    };

    const createdUser = new this.userModel(userData);
    const savedUser = await createdUser.save();

    const safeUser = await this.userModel
      .findById(savedUser._id, USER_SAFE_PROJECTION)
      .exec();
    return safeUser!;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: updateUserDto, updatedAt: new Date() },
        {
          new: true,
          select: USER_SAFE_SELECT
        }
      )
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel
      .findByIdAndDelete(id, { select: USER_SAFE_SELECT })
      .exec();
  }

  async seedTest(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel({ ...userData, createdAt: new Date() });
    const savedUser = await newUser.save();

    const safeUser = await this.userModel
      .findById(savedUser._id, USER_SAFE_PROJECTION)
      .exec();
    return safeUser!;
  }
}
