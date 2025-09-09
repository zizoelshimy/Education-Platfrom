import { Module } from '@nestjs/common';
import { UserController } from '@presentation/controllers/user.controller';
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetUserByEmailUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  GetUsersByRoleUseCase,
} from '@application/use-cases/user.use-cases';
import { UserRepositoryImpl } from '@infrastructure/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@shared/constants/injection.tokens';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    // Use cases
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUsersByRoleUseCase,
    // Repository
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    USER_REPOSITORY_TOKEN,
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUsersByRoleUseCase,
  ],
})
export class UserModule {}
