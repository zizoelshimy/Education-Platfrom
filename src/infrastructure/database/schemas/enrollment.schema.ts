import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EnrollmentStatus } from '@domain/value-objects/enrollment.enums';

export type EnrollmentDocument = EnrollmentSchema & Document;

@Schema({
  timestamps: true,
  collection: 'enrollments',
})
export class EnrollmentSchema {
  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CourseSchema', required: true })
  courseId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(EnrollmentStatus),
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  progress: number; // percentage 0-100

  @Prop({ default: Date.now })
  enrolledAt: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  droppedAt?: Date;

  @Prop()
  lastAccessedAt?: Date;

  @Prop({ default: false })
  certificateIssued: boolean;

  @Prop()
  certificateIssuedAt?: Date;

  @Prop({ type: Number, min: 0, max: 100 })
  grade?: number;

  @Prop()
  feedback?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const EnrollmentMongoSchema =
  SchemaFactory.createForClass(EnrollmentSchema);

// Indexes
EnrollmentMongoSchema.index({ studentId: 1 });
EnrollmentMongoSchema.index({ courseId: 1 });
EnrollmentMongoSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
EnrollmentMongoSchema.index({ status: 1 });
EnrollmentMongoSchema.index({ progress: 1 });
EnrollmentMongoSchema.index({ enrolledAt: -1 });
EnrollmentMongoSchema.index({ completedAt: -1 });
EnrollmentMongoSchema.index({ certificateIssued: 1 });
