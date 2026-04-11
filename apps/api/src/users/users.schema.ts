import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthProvider } from '../common/enums/auth-provider.enum';
import { IsDate, IsOptional, IsString } from 'class-validator';

export type UserDocument = User & Document;

export enum UserRole {
  NORMAL = 'normal',
  AGENT = 'agent',
  ADMIN = 'admin'
}

@Schema({ _id: false })
export class PasswordReset {
  @Prop()
  @IsOptional()
  @IsString()
  token?: string;

  @Prop()
  @IsOptional()
  @IsDate()
  expires?: Date;
}

@Schema({ timestamps: false }) //TODO: After seeded, we can turn back to true and remove manual createdAt, updatedAt
export class User {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: false })
  emailVerified: boolean;

  @Prop({ required: true, enum: AuthProvider })
  provider: AuthProvider;

  @Prop({ required: true, enum: UserRole, default: UserRole.NORMAL })
  role: UserRole;

  @Prop({ required: true, default: false })
  tos: boolean;

  // Cannot mark as required as on create mode it start with undefined and pre save hook will generate id for it, can mark as required once migrated
  @Prop()
  cid: number;

  @Prop()
  emailVToken?: string;

  @Prop()
  password?: string;

  @Prop({ select: false })
  temp_p?: string; //TODO: Assign raw password for those migrated users, Once migrated, remove this field from code and users collection

  @Prop()
  phone?: string;

  @Prop()
  line?: string;

  @Prop()
  profileImg?: string;

  @Prop()
  passwordReset?: PasswordReset;

  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({ unique: true, sparse: true })
  facebookId?: string;

  @Prop({ enum: AuthProvider })
  lastLoginProvider?: AuthProvider;

  @Prop({ type: Date })
  lastLoginAt?: Date;

  @Prop({ required: true, type: Date })
  createdAt: Date; //TODO: After seeded, we can remove this

  // Auto-assigned to the own user id at the pre save hook
  @Prop()
  createdBy?: string;

  @Prop({ type: Date })
  updatedAt?: Date; //TODO: After seeded, we can remove this

  @Prop()
  updatedBy?: string;

  @Prop()
  ___id?: string; //TODO: Firebase Id, can be remove later

  @Prop({ default: false })
  ___f_pre_auth_mail_sent: boolean; //TODO: Remove later

  @Prop({ default: false })
  ___f_auth_mail_sent: boolean; //TODO: Remove later
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Assign manual auto incremental for cid
    const lastUser = await (this.constructor as mongoose.Model<UserDocument>)
      .findOne({}, { cid: 1 }, { sort: { cid: -1 } })
      .lean();
    this.cid = (lastUser?.cid ?? 0) + 1;

    if (!this.createdBy) {
      this.createdBy = this._id;
    }
  }

  if (this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});
