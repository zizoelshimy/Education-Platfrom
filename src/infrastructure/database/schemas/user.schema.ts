import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from '@domain/value-objects/user.enums';

export type UserDocument = UserSchema & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserSchema {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    required: true,
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  phone?: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  address?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserMongoSchema = SchemaFactory.createForClass(UserSchema);

// Indexes for better performance
UserMongoSchema.index({ email: 1 }, { unique: true });
UserMongoSchema.index({ role: 1 });
UserMongoSchema.index({ status: 1 });
UserMongoSchema.index({ emailVerificationToken: 1 });
UserMongoSchema.index({ passwordResetToken: 1 });
UserMongoSchema.index({ createdAt: -1 });
