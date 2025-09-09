import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  CourseStatus,
  CourseLevel,
  CourseType,
} from '@domain/value-objects/course.enums';

export type CourseDocument = CourseSchema & Document;

@Schema({
  timestamps: true,
  collection: 'courses',
})
export class CourseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  instructorId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(CourseLevel),
    required: true,
  })
  level: CourseLevel;

  @Prop({
    type: String,
    enum: Object.values(CourseType),
    default: CourseType.ONLINE,
  })
  type: CourseType;

  @Prop({
    type: String,
    enum: Object.values(CourseStatus),
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Prop({ type: Number, default: 0, min: 0 })
  price: number;

  @Prop({ type: Number, default: 0, min: 0 })
  duration: number; // in minutes

  @Prop({ type: Number, default: 0, min: 0 })
  maxStudents: number; // 0 means unlimited

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category?: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  previewVideo?: string;

  @Prop({ type: [String], default: [] })
  syllabus: string[];

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop({ type: [String], default: [] })
  learningObjectives: string[];

  @Prop({ default: 'English' })
  language: string;

  @Prop({ default: false })
  certificateEnabled: boolean;

  @Prop({ type: Number, default: 0, min: 0 })
  enrollmentCount: number;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: Number, default: 0, min: 0 })
  ratingCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  publishedAt?: Date;
}

export const CourseMongoSchema = SchemaFactory.createForClass(CourseSchema);

// Indexes for better performance
CourseMongoSchema.index({ instructorId: 1 });
CourseMongoSchema.index({ status: 1 });
CourseMongoSchema.index({ level: 1 });
CourseMongoSchema.index({ type: 1 });
CourseMongoSchema.index({ category: 1 });
CourseMongoSchema.index({ tags: 1 });
CourseMongoSchema.index({ price: 1 });
CourseMongoSchema.index({ rating: -1 });
CourseMongoSchema.index({ enrollmentCount: -1 });
CourseMongoSchema.index({ createdAt: -1 });
CourseMongoSchema.index({ publishedAt: -1 });

// Text search index
CourseMongoSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
});
