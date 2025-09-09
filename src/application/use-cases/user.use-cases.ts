import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '@application/dto/user.dto';
import { UserRole, UserStatus } from '@domain/value-objects/user.enums';
import { USER_REPOSITORY_TOKEN } from '@shared/constants/injection.tokens';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
  InvalidPasswordException,
  ValidationException,
} from '@shared/exceptions/domain.exceptions';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    // Validate password strength (additional validation beyond DTO)
    if (!this.isPasswordSecure(createUserDto.password)) {
      throw new ValidationException(
        'password',
        'Password does not meet security requirements',
      );
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Generate a unique ID
    const id = crypto.randomUUID();

    // Create user entity
    const user = new User(
      id,
      createUserDto.email,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.role,
      hashedPassword,
      UserStatus.PENDING,
      false,
      createUserDto.phone,
      createUserDto.bio,
    );

    try {
      return await this.userRepository.create(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  private isPasswordSecure(password: string): boolean {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      hasUppercase &&
      hasLowercase &&
      hasNumbers &&
      hasSpecialChar &&
      password.length >= 8
    );
  }
}

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    if (!id) {
      throw new ValidationException('id', 'User ID is required');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }
}

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<User> {
    if (!email) {
      throw new ValidationException('email', 'Email is required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(`user with email ${email}`);
    }

    return user;
  }
}

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(filters?: any): Promise<User[]> {
    return await this.userRepository.findAll(filters);
  }
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new ValidationException('id', 'User ID is required');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundException(id);
    }

    const updateData: Partial<User> = {
      ...updateUserDto,
      updatedAt: new Date(),
    };

    try {
      const updatedUser = await this.userRepository.update(id, updateData);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    if (!id) {
      throw new ValidationException('id', 'User ID is required');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundException(id);
    }

    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

@Injectable()
export class GetUsersByRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(role: UserRole): Promise<User[]> {
    if (!role) {
      throw new ValidationException('role', 'User role is required');
    }

    try {
      return await this.userRepository.findByRole(role);
    } catch (error) {
      throw new Error(`Failed to get users by role: ${error.message}`);
    }
  }
}

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    if (!id) {
      throw new ValidationException('id', 'User ID is required');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.hashedPassword,
    );

    if (!isCurrentPasswordValid) {
      throw new InvalidPasswordException();
    }

    // Ensure new password is different from current
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.hashedPassword,
    );

    if (isSamePassword) {
      throw new ValidationException(
        'newPassword',
        'New password must be different from current password',
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      12,
    );

    try {
      return await this.userRepository.updatePassword(id, hashedNewPassword);
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }
}
