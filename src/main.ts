import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import helmet from 'helmet';
import * as compression from 'compression';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function performHealthCheck(app: any, configService: ConfigService) {
  const logMessages: string[] = [];
  const addLog = (message: string) => {
    console.log(message);
    logMessages.push(message.replace(/[^\x20-\x7E]/g, '')); // Remove emojis for file log
  };

  addLog('\n🔍 Performing startup health checks...\n');

  try {
    // Database connection check
    const connection: Connection = app.get(getConnectionToken());
    const dbState = connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus = states[dbState] || 'unknown';
    const isDbConnected = dbState === 1;

    addLog('📊 System Health Check Results:');
    addLog('═'.repeat(50));

    // Database Status
    addLog(
      `💾 Database Status: ${isDbConnected ? '✅' : '❌'} ${dbStatus.toUpperCase()}`,
    );
    if (isDbConnected) {
      addLog(`   📍 Database Name: ${connection.name || 'Education-platform'}`);
      addLog(`   🌐 Host: ${connection.host}`);
      addLog(
        `   📁 Collections: ${Object.keys(connection.collections).length || 0}`,
      );
    }

    // Environment Status
    const nodeEnv = configService.get('NODE_ENV', 'development');
    addLog(`🌍 Environment: ${nodeEnv.toUpperCase()}`);

    // Configuration Status
    const requiredConfigs = [
      { key: 'MONGODB_URI', name: 'MongoDB URI' },
      { key: 'JWT_SECRET', name: 'JWT Secret' },
      { key: 'PORT', name: 'Port' },
    ];

    addLog('⚙️  Configuration Status:');
    let configErrors = 0;

    requiredConfigs.forEach((config) => {
      const value = configService.get(config.key);
      const isValid =
        value &&
        value !== 'your-super-secret-jwt-key-change-this-in-production' &&
        value !== 'your-super-secret-refresh-key-change-this-too';
      addLog(
        `   ${isValid ? '✅' : '❌'} ${config.name}: ${isValid ? 'OK' : 'MISSING/DEFAULT'}`,
      );
      if (!isValid) configErrors++;
    });

    // Memory Usage
    const memUsage = process.memoryUsage();
    addLog('💾 Memory Usage:');
    addLog(`   RSS: ${Math.round(memUsage.rss / 1024 / 1024)} MB`);
    addLog(`   Heap Used: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);

    // Overall Status
    addLog('═'.repeat(50));
    const overallHealthy = isDbConnected && configErrors === 0;
    addLog(
      `🎯 Overall Status: ${overallHealthy ? '✅ HEALTHY' : '⚠️  ISSUES DETECTED'}`,
    );

    if (!overallHealthy) {
      addLog('\n⚠️  Please check the issues above before proceeding.');
      if (!isDbConnected) {
        addLog(
          '💡 Database connection failed. Check your MONGODB_URI in .env file.',
        );
      }
      if (configErrors > 0) {
        addLog('💡 Some configurations are missing or using default values.');
        addLog('💡 Check your .env file and update the following:');
        if (
          configService.get('JWT_SECRET') ===
          'your-super-secret-jwt-key-change-this-in-production'
        ) {
          addLog('   - JWT_SECRET: Generate a strong secret key');
        }
        if (
          configService.get('JWT_REFRESH_SECRET') ===
          'your-super-secret-refresh-key-change-this-too'
        ) {
          addLog('   - JWT_REFRESH_SECRET: Generate a strong refresh secret');
        }
      }
    }

    addLog(''); // Empty line for better formatting

    // Save to log file
    const timestamp = new Date().toISOString();
    const logContent = `
=== HEALTH CHECK LOG - ${timestamp} ===
${logMessages.join('\n')}
=====================================

`;

    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Write to health check log file
    const logFile = path.join(logsDir, 'health-check.log');
    fs.appendFileSync(logFile, logContent);

    return overallHealthy;
  } catch (error) {
    const errorMsg = `❌ Health check failed: ${error.message}`;
    console.error(errorMsg);

    // Log error to file
    const timestamp = new Date().toISOString();
    const errorLog = `[${timestamp}] ${errorMsg}\n`;
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    fs.appendFileSync(path.join(logsDir, 'error.log'), errorLog);

    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Education Platform API')
      .setDescription('Education Platform API for Students and Teachers')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(
      configService.get('SWAGGER_PATH', 'docs'),
      app,
      document,
    );
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  // Perform health check after startup
  const isHealthy = await performHealthCheck(app, configService);

  console.log(
    `🚀 Education Platform API is running on: http://localhost:${port}`,
  );
  console.log(
    `📚 API Documentation: http://localhost:${port}/${configService.get('SWAGGER_PATH', 'docs')}`,
  );
  console.log(
    `🔍 Health Check: http://localhost:${port}/${configService.get('API_PREFIX', 'api/v1')}/health`,
  );

  if (isHealthy) {
    console.log('🎉 All systems are operational! Ready to serve requests.\n');
  } else {
    console.log('⚠️  Some issues detected. Check logs above for details.\n');
  }
}

bootstrap();
