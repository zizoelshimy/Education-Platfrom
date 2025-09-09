import { EnrollmentStatus } from '@domain/value-objects/enrollment.enums';

export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly status: EnrollmentStatus = EnrollmentStatus.ACTIVE,
    public readonly progress: number = 0, // percentage 0-100
    public readonly enrolledAt: Date = new Date(),
    public readonly completedAt?: Date,
    public readonly droppedAt?: Date,
    public readonly lastAccessedAt?: Date,
    public readonly certificateIssued: boolean = false,
    public readonly certificateIssuedAt?: Date,
    public readonly grade?: number,
    public readonly feedback?: string,
  ) {}

  isActive(): boolean {
    return this.status === EnrollmentStatus.ACTIVE;
  }

  isCompleted(): boolean {
    return this.status === EnrollmentStatus.COMPLETED;
  }

  isDropped(): boolean {
    return this.status === EnrollmentStatus.DROPPED;
  }

  isSuspended(): boolean {
    return this.status === EnrollmentStatus.SUSPENDED;
  }

  getProgressPercentage(): number {
    return Math.min(Math.max(this.progress, 0), 100);
  }

  canReceiveCertificate(): boolean {
    return this.isCompleted() && this.progress >= 80 && !this.certificateIssued;
  }

  updateProgress(newProgress: number): Enrollment {
    const updatedProgress = Math.min(Math.max(newProgress, 0), 100);
    const isNowCompleted = updatedProgress === 100;

    return new Enrollment(
      this.id,
      this.studentId,
      this.courseId,
      isNowCompleted ? EnrollmentStatus.COMPLETED : this.status,
      updatedProgress,
      this.enrolledAt,
      isNowCompleted ? new Date() : this.completedAt,
      this.droppedAt,
      new Date(),
      this.certificateIssued,
      this.certificateIssuedAt,
      this.grade,
      this.feedback,
    );
  }
}
