export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class Course {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly instructorId: string,
    public readonly level: CourseLevel,
    public readonly status: CourseStatus = CourseStatus.DRAFT,
    public readonly price: number = 0,
    public readonly duration: number = 0, // in minutes
    public readonly maxStudents: number = 0, // 0 means unlimited
    public readonly tags: string[] = [],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
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

  isFree(): boolean {
    return this.price === 0;
  }

  hasStudentLimit(): boolean {
    return this.maxStudents > 0;
  }

  canEnroll(currentStudentsCount: number): boolean {
    return (
      this.isPublished() &&
      (!this.hasStudentLimit() || currentStudentsCount < this.maxStudents)
    );
  }

  getDurationInHours(): number {
    return Math.round((this.duration / 60) * 100) / 100;
  }
}
