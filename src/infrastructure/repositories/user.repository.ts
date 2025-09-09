import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  // This will be implemented with MongoDB later
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  async create(userData: User): Promise<User> {
    this.users.push(userData);
    return userData;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updatedUser = { ...this.users[index], ...userData };
    this.users[index] = updatedUser as User;
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  async findAll(filters?: any): Promise<User[]> {
    return this.users;
  }

  async findByRole(role: any): Promise<User[]> {
    return this.users.filter((u) => u.role === role);
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const user = this.users.find((u) => u.emailVerificationToken === token);
    return user || null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const user = this.users.find((u) => u.passwordResetToken === token);
    return user || null;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    await this.update(id, { hashedPassword, updatedAt: new Date() });
    return true;
  }

  async verifyEmail(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    await this.update(id, { emailVerified: true, updatedAt: new Date() });
    return true;
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    await this.update(id, { refreshToken, updatedAt: new Date() });
    return true;
  }
}
