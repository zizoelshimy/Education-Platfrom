import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import {
  UserSchema,
  UserDocument,
} from '@infrastructure/database/schemas/user.schema';
import { UserRole } from '@domain/value-objects/user.enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    if (!userDoc) return null;
    return this.mapDocumentToEntity(userDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    if (!userDoc) return null;
    return this.mapDocumentToEntity(userDoc);
  }

  async create(userData: User): Promise<User> {
    const userDoc = new this.userModel({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      hashedPassword: userData.hashedPassword,
      role: userData.role,
      status: userData.status,
      phone: userData.phone,
      bio: userData.bio,
      emailVerified: userData.emailVerified,
      avatar: userData.avatar,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
      refreshToken: userData.refreshToken,
      emailVerificationToken: userData.emailVerificationToken,
      passwordResetToken: userData.passwordResetToken,
      passwordResetExpires: userData.passwordResetExpires,
      lastLoginAt: userData.lastLoginAt,
    });

    const savedUser = await userDoc.save();
    return this.mapDocumentToEntity(savedUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const updateData: any = {};

    if (userData.firstName) updateData.firstName = userData.firstName;
    if (userData.lastName) updateData.lastName = userData.lastName;
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.bio) updateData.bio = userData.bio;
    if (userData.status) updateData.status = userData.status;

    updateData.updatedAt = new Date();

    const userDoc = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!userDoc) return null;
    return this.mapDocumentToEntity(userDoc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(filters?: any): Promise<User[]> {
    const userDocs = await this.userModel.find(filters || {}).exec();
    return userDocs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const userDocs = await this.userModel.find({ role }).exec();
    return userDocs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const userDoc = await this.userModel
      .findOne({ emailVerificationToken: token })
      .exec();
    if (!userDoc) return null;
    return this.mapDocumentToEntity(userDoc);
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const userDoc = await this.userModel
      .findOne({ passwordResetToken: token })
      .exec();
    if (!userDoc) return null;
    return this.mapDocumentToEntity(userDoc);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { hashedPassword, updatedAt: new Date() })
      .exec();
    return !!result;
  }

  async verifyEmail(id: string): Promise<boolean> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { emailVerified: true, updatedAt: new Date() })
      .exec();
    return !!result;
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<boolean> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { refreshToken, updatedAt: new Date() })
      .exec();
    return !!result;
  }

  private mapDocumentToEntity(doc: UserDocument): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.firstName,
      doc.lastName,
      doc.role,
      doc.hashedPassword,
      doc.status,
      doc.emailVerified,
      doc.phone,
      doc.bio,
      doc.avatar,
      doc.dateOfBirth,
      doc.address,
      doc.refreshToken,
      doc.emailVerificationToken,
      doc.passwordResetToken,
      doc.passwordResetExpires,
      doc.lastLoginAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
