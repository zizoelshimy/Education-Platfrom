import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProfileDocument = ProfileSchema & Document;

@Schema({
  timestamps: true,
  collection: 'profiles',
})
export class ProfileSchema {
  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  website?: string;

  @Prop({
    type: {
      linkedin: String,
      twitter: String,
      github: String,
      facebook: String,
    },
  })
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  };

  @Prop({
    type: {
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    default: {},
  })
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark';
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProfileMongoSchema = SchemaFactory.createForClass(ProfileSchema);

// Indexes
ProfileMongoSchema.index({ userId: 1 }, { unique: true });
ProfileMongoSchema.index({ createdAt: -1 });
