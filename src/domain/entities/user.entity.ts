export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly status: UserStatus = UserStatus.ACTIVE,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
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
    return this.role === UserRole.TEACHER || this.role === UserRole.ADMIN;
  }

  canEnrollInCourse(): boolean {
    return this.role === UserRole.STUDENT;
  }
}
