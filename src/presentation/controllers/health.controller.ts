import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: this.connection.readyState === 1 ? 'connected' : 'disconnected',
        name: this.connection.name,
        host: this.connection.host,
      },
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    };
  }

  @Get('database')
  @ApiOperation({ summary: 'Database connection check' })
  @ApiResponse({ status: 200, description: 'Database connection status' })
  async databaseCheck() {
    const dbState = this.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return {
      database: {
        status: states[dbState] || 'unknown',
        readyState: dbState,
        name: this.connection.name,
        host: this.connection.host,
        collections: Object.keys(this.connection.collections),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
