import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, CourseStatus } from '@domain/value-objects/course.enums';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to TypeScript' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn TypeScript from basics to advanced concepts' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.BEGINNER })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiPropertyOptional({ example: 99.99 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 1200 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxStudents?: number;

  @ApiPropertyOptional({ example: ['typescript', 'javascript', 'programming'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced TypeScript Concepts' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Deep dive into advanced TypeScript features',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: CourseLevel, example: CourseLevel.ADVANCED })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional({ enum: CourseStatus, example: CourseStatus.PUBLISHED })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;

  @ApiPropertyOptional({ example: 149.99 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 1800 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxStudents?: number;

  @ApiPropertyOptional({ example: ['typescript', 'advanced', 'generics'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
