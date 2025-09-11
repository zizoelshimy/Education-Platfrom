import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { GetUserByEmailUseCase } from '@application/use-cases/user.use-cases';
import { RegisterUserUseCase } from '@application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from '@application/use-cases/verify-email.use-case';
import { LoginDto, RegisterDto } from '@application/dto/auth.dto';
import { Public } from '@presentation/decorators/public.decorator';
import { InvalidPasswordException, EmailNotVerifiedException } from '@shared/exceptions/domain.exceptions';
import * as bcrypt from 'bcryptjs';

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  expires_in: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ 
    status: 201, 
    description: 'Registration successful. Please check your email to verify your account.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        userId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return await this.registerUserUseCase.execute(registerDto);
  }

  @Get('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiQuery({ name: 'token', description: 'Email verification token', required: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    return await this.verifyEmailUseCase.execute(token);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
          },
        },
        expires_in: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials or email not verified' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    // Step 1: Find user by email
    const user = await this.getUserByEmailUseCase.execute(loginDto.email);
    
    // Step 2: Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    // Step 3: Check if email is verified
    if (!user.emailVerified) {
      throw new EmailNotVerifiedException();
    }

    // Step 4: Generate JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Step 5: Sign JWT token
    const accessToken = await this.jwtService.signAsync(payload);

    // Step 6: Return response
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      expires_in: '15m', // From JWT_EXPIRATION
    };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() body: { refresh_token: string }): Promise<{ access_token: string }> {
    // This would implement refresh token logic
    // For now, just return a placeholder
    throw new Error('Refresh token functionality not implemented yet');
  }
}
