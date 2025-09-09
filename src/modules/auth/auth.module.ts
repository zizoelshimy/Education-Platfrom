import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthController } from '@presentation/controllers/auth.controller';
import { RegisterUserUseCase } from '@application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from '@application/use-cases/verify-email.use-case';
import { EmailService } from '@infrastructure/services/email.service';
import { EMAIL_SERVICE_TOKEN } from '@shared/constants/injection.tokens';

@Module({
  imports: [
    UserModule, // Import UserModule to access user-related use cases and repositories
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
  controllers: [AuthController],
  providers: [
    // Use cases
    RegisterUserUseCase,
    VerifyEmailUseCase,
    // Services
    {
      provide: EMAIL_SERVICE_TOKEN,
      useClass: EmailService,
    },
  ],
  exports: [
    RegisterUserUseCase,
    VerifyEmailUseCase,
    EMAIL_SERVICE_TOKEN,
    JwtModule,
  ],
})
export class AuthModule {}
