import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from '@presentation/controllers/user.controller';
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
import { UserRepositoryImpl } from '@infrastructure/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@shared/constants/injection.tokens';
import {
  UserSchema,
  UserMongoSchema,
} from '@infrastructure/database/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserMongoSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
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
    ChangePasswordUseCase,
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
    ChangePasswordUseCase,
    JwtModule,
  ],
})
export class UserModule {}
