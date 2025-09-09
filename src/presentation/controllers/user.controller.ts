import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetUserByEmailUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  GetUsersByRoleUseCase,
  ChangePasswordUseCase,
} from '@application/use-cases/user.use-cases';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserResponseDto,
} from '@application/dto/user.dto';
import { UserRole } from '@domain/value-objects/user.enums';
import {
  ValidationPipe,
  ParseObjectIdPipe,
} from '@presentation/pipes/validation.pipe';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/guards/roles.guard';
import { Roles } from '@presentation/decorators/roles.decorator';
import { Public } from '@presentation/decorators/public.decorator';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUsersByRoleUseCase: GetUsersByRoleUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(createUserDto);
    return this.mapToResponseDto(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieve all users in the system. Requires ADMIN role and valid JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      },
    },
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  async getAllUsers(
    @Query('role') role?: UserRole,
  ): Promise<UserResponseDto[]> {
    let users;
    if (role) {
      users = await this.getUsersByRoleUseCase.execute(role);
    } else {
      users = await this.getAllUsersUseCase.execute();
    }

    return users.map((user) => this.mapToResponseDto(user));
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieve the profile of the currently authenticated user. Requires valid JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getCurrentUser(
    @CurrentUser() currentUser: any,
  ): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(currentUser.sub);
    return this.mapToResponseDto(user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve a specific user by their ID. Requires ADMIN or TEACHER role and valid JWT token.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Teacher role required',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getUserById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);
    return this.mapToResponseDto(user);
  }

  @Get('email/:email')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Get user by email',
    description:
      'Retrieve a specific user by their email address. Requires ADMIN or TEACHER role and valid JWT token.',
  })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Teacher role required',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    const user = await this.getUserByEmailUseCase.execute(email);
    return this.mapToResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'Update a user by their ID. Users can only update their own profile unless they are an admin. Requires valid JWT token.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Validation error' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update own profile (unless admin)',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'You can only update your own profile',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async updateUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<UserResponseDto> {
    // Users can only update their own profile unless they're admin
    if (currentUser.role !== UserRole.ADMIN && currentUser.sub !== id) {
      throw new Error('Unauthorized to update this user');
    }

    const user = await this.updateUserUseCase.execute(id, updateUserDto);
    return this.mapToResponseDto(user);
  }

  @Put(':id/password')
  @ApiOperation({
    summary: 'Change user password',
    description:
      'Change user password. Users can only change their own password unless they are an admin. Requires valid JWT token.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid current password' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only change own password (unless admin)',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'You can only change your own password',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async changePassword(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: any,
  ): Promise<{ message: string }> {
    // Users can only change their own password unless they're admin
    if (currentUser.role !== UserRole.ADMIN && currentUser.sub !== id) {
      throw new Error("Unauthorized to change this user's password");
    }

    await this.changePasswordUseCase.execute(id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete user by ID',
    description:
      'Delete a user by their ID. Requires ADMIN role and valid JWT token.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Access token is required',
    schema: {
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Access token is required',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      },
    },
  })
  @ApiBearerAuth('access-token')
  async deleteUser(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<{ message: string }> {
    await this.deleteUserUseCase.execute(id);
    return { message: 'User deleted successfully' };
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
