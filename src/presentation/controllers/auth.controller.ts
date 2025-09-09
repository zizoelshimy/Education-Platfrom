import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { GetUserByEmailUseCase } from '@application/use-cases/user.use-cases';
import { LoginDto } from '@application/dto/user.dto';
import { Public } from '@presentation/decorators/public.decorator';
import { InvalidPasswordException } from '@shared/exceptions/domain.exceptions';
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

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly jwtService: JwtService,
  ) {}

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
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

    // Step 3: Generate JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Step 4: Sign JWT token
    const accessToken = await this.jwtService.signAsync(payload);

    // Step 5: Return response
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
  async refresh(
    @Body() body: { refresh_token: string },
  ): Promise<{ access_token: string }> {
    // This would implement refresh token logic
    // For now, just return a placeholder
    throw new Error('Refresh token functionality not implemented yet');
  }
}
