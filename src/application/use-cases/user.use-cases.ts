import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@application/dto/user.dto';
import { UserRole, UserStatus } from '@domain/value-objects/user.enums';
import { USER_REPOSITORY_TOKEN } from '@shared/constants/injection.tokens';

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
      throw new Error('User with this email already exists');
    }

    // For now, we'll use a simple password hash (in real implementation, use bcrypt)
    const hashedPassword = `hashed_${createUserDto.password}`;

    // Generate a simple ID (in real implementation, use uuid)
    const id = Math.random().toString(36).substr(2, 9);

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

    return await this.userRepository.create(user);
  }
}

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
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

  async execute(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updateData: Partial<User> = {
      ...updateUserDto,
      updatedAt: new Date(),
    };

    return await this.userRepository.update(id, updateData);
  }
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return await this.userRepository.delete(id);
  }
}

@Injectable()
export class GetUsersByRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(role: UserRole): Promise<User[]> {
    return await this.userRepository.findByRole(role);
  }
}
