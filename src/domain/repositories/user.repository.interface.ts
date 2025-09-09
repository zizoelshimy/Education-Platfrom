import { User } from '@domain/entities/user.entity';
import { UserRole } from '@domain/value-objects/user.enums';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: User): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findAll(filters?: any): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  findByEmailVerificationToken(token: string): Promise<User | null>;
  findByPasswordResetToken(token: string): Promise<User | null>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;
  verifyEmail(id: string): Promise<boolean>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<boolean>;
}
