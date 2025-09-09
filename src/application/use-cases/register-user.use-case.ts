import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IEmailService } from '@domain/services/email.service.interface';
import { User } from '@domain/entities/user.entity';
import { RegisterDto } from '@application/dto/auth.dto';
import { UserRole, UserStatus } from '@domain/value-objects/user.enums';
import {
  USER_REPOSITORY_TOKEN,
  EMAIL_SERVICE_TOKEN,
} from '@shared/constants/injection.tokens';
import {
  UserAlreadyExistsException,
  ValidationException,
} from '@shared/exceptions/domain.exceptions';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(EMAIL_SERVICE_TOKEN)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    registerDto: RegisterDto,
  ): Promise<{ message: string; userId: string }> {
    // Step 1: Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new UserAlreadyExistsException(registerDto.email);
    }

    // Step 2: Validate password strength (additional validation beyond DTO)
    if (!this.isPasswordSecure(registerDto.password)) {
      throw new ValidationException(
        'password',
        'Password does not meet security requirements',
      );
    }

    // Step 3: Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Step 4: Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Step 5: Generate unique user ID
    const userId = crypto.randomUUID();

    // Step 6: Create user entity
    const user = new User(
      userId,
      registerDto.email,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.role,
      hashedPassword,
      UserStatus.PENDING, // User status is PENDING until email verification
      false, // emailVerified is false initially
      registerDto.phone,
      registerDto.bio,
      undefined, // avatar
      undefined, // dateOfBirth
      undefined, // address
      undefined, // refreshToken
      emailVerificationToken,
      undefined, // passwordResetToken
      undefined, // passwordResetExpires
      undefined, // lastLoginAt
      new Date(), // createdAt
      new Date(), // updatedAt
    );

    try {
      // Step 7: Save user to database
      const savedUser = await this.userRepository.create(user);

      // Step 8: Send verification email
      await this.emailService.sendVerificationEmail(
        registerDto.email,
        emailVerificationToken,
        registerDto.firstName,
      );

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
        userId: savedUser.id,
      };
    } catch (error) {
      // If email sending fails after user creation, we should log but not fail
      if (error.message?.includes('Failed to send verification email')) {
        return {
          message:
            'Registration successful, but verification email could not be sent. Please contact support.',
          userId,
        };
      }
      throw new Error(`Failed to register user: ${error.message}`);
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
