import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IEmailService } from '@domain/services/email.service.interface';
import { UserStatus } from '@domain/value-objects/user.enums';
import {
  USER_REPOSITORY_TOKEN,
  EMAIL_SERVICE_TOKEN,
} from '@shared/constants/injection.tokens';
import {
  UserNotFoundException,
  ValidationException,
} from '@shared/exceptions/domain.exceptions';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(EMAIL_SERVICE_TOKEN)
    private readonly emailService: IEmailService,
  ) {}

  async execute(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new ValidationException('token', 'Verification token is required');
    }

    // Step 1: Find user by verification token
    const user = await this.userRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new UserNotFoundException('User with this verification token');
    }

    // Step 2: Check if user is already verified
    if (user.emailVerified) {
      return { message: 'Email is already verified. You can now log in.' };
    }

    // Step 3: Update user status to ACTIVE and set emailVerified to true
    await this.userRepository.verifyEmail(user.id);

    // Step 4: Send welcome email (optional, don't fail if it doesn't send)
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.firstName);
    } catch (error) {
      // Log the error but don't fail the verification process
      console.error('Failed to send welcome email:', error);
    }

    return {
      message:
        'Email verified successfully! Your account is now active and you can log in.',
    };
  }
}
