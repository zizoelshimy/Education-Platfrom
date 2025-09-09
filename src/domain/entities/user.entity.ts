import { UserRole, UserStatus } from '@domain/value-objects/user.enums';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly hashedPassword: string,
    public readonly status: UserStatus = UserStatus.PENDING,
    public readonly emailVerified: boolean = false,
    public readonly phone?: string,
    public readonly bio?: string,
    public readonly avatar?: string,
    public readonly dateOfBirth?: Date,
    public readonly address?: string,
    public readonly refreshToken?: string,
    public readonly emailVerificationToken?: string,
    public readonly passwordResetToken?: string,
    public readonly passwordResetExpires?: Date,
    public readonly lastLoginAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  isTeacher(): boolean {
    return this.role === UserRole.TEACHER;
  }

  isStudent(): boolean {
    return this.role === UserRole.STUDENT;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canCreateCourse(): boolean {
    return (
      (this.role === UserRole.TEACHER || this.role === UserRole.ADMIN) &&
      this.isActive()
    );
  }

  canEnrollInCourse(): boolean {
    return this.role === UserRole.STUDENT && this.isActive();
  }

  canAccessAdminPanel(): boolean {
    return this.role === UserRole.ADMIN && this.isActive();
  }

  isPasswordResetTokenValid(): boolean {
    if (!this.passwordResetToken || !this.passwordResetExpires) {
      return false;
    }
    return new Date() < this.passwordResetExpires;
  }
}
