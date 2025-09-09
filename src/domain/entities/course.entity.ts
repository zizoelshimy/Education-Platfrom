import {
  CourseStatus,
  CourseLevel,
  CourseType,
} from '@domain/value-objects/course.enums';

export class Course {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly instructorId: string,
    public readonly level: CourseLevel,
    public readonly type: CourseType = CourseType.ONLINE,
    public readonly status: CourseStatus = CourseStatus.DRAFT,
    public readonly price: number = 0,
    public readonly duration: number = 0, // in minutes
    public readonly maxStudents: number = 0, // 0 means unlimited
    public readonly tags: string[] = [],
    public readonly category?: string,
    public readonly thumbnail?: string,
    public readonly previewVideo?: string,
    public readonly syllabus?: string[],
    public readonly requirements?: string[],
    public readonly learningObjectives?: string[],
    public readonly language: string = 'English',
    public readonly certificateEnabled: boolean = false,
    public readonly enrollmentCount: number = 0,
    public readonly rating: number = 0,
    public readonly ratingCount: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly publishedAt?: Date,
  ) {}

  isPublished(): boolean {
    return this.status === CourseStatus.PUBLISHED;
  }

  isDraft(): boolean {
    return this.status === CourseStatus.DRAFT;
  }

  isArchived(): boolean {
    return this.status === CourseStatus.ARCHIVED;
  }

  isSuspended(): boolean {
    return this.status === CourseStatus.SUSPENDED;
  }

  isFree(): boolean {
    return this.price === 0;
  }

  hasStudentLimit(): boolean {
    return this.maxStudents > 0;
  }

  canEnroll(currentStudentsCount: number = this.enrollmentCount): boolean {
    return (
      this.isPublished() &&
      (!this.hasStudentLimit() || currentStudentsCount < this.maxStudents)
    );
  }

  getDurationInHours(): number {
    return Math.round((this.duration / 60) * 100) / 100;
  }

  getAverageRating(): number {
    return this.ratingCount > 0 ? this.rating / this.ratingCount : 0;
  }

  isEligibleForCertificate(): boolean {
    return this.certificateEnabled && this.isPublished();
  }
}
