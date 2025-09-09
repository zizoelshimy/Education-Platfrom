import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = SessionSchema & Document;

@Schema({
  timestamps: true,
  collection: 'sessions',
})
export class SessionSchema {
  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  refreshToken: string;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  })
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastUsedAt: Date;
}

export const SessionMongoSchema = SchemaFactory.createForClass(SessionSchema);

// Indexes
SessionMongoSchema.index({ userId: 1 });
SessionMongoSchema.index({ refreshToken: 1 }, { unique: true });
SessionMongoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionMongoSchema.index({ isActive: 1 });
SessionMongoSchema.index({ createdAt: -1 });
