import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '@application/use-cases/user.use-cases';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from '@shared/constants/injection.tokens';
import { UserRole, UserStatus } from '@domain/value-objects/user.enums';
import { UserAlreadyExistsException } from '@shared/exceptions/domain.exceptions';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByRole: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      findByPasswordResetToken: jest.fn(),
      updatePassword: jest.fn(),
      verifyEmail: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.STUDENT,
        phone: '+1234567890',
        bio: 'Test bio',
      };

      const expectedUser = {
        id: 'some-uuid',
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: createUserDto.role,
        hashedPassword: 'hashed-password',
        status: UserStatus.PENDING,
        emailVerified: false,
        phone: createUserDto.phone,
        bio: createUserDto.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser as any);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });

    it('should throw UserAlreadyExistsException if user exists', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.STUDENT,
      };

      const existingUser = { id: '1', email: createUserDto.email };
      mockUserRepository.findByEmail.mockResolvedValue(existingUser as any);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
