import { createLogger, format, transports } from 'winston';
import { ConfigService } from '@nestjs/config';

export class Logger {
  private static instance: any;

  public static getInstance(configService: ConfigService) {
    if (!Logger.instance) {
      const logLevel = configService.get('LOG_LEVEL', 'info');
      const nodeEnv = configService.get('NODE_ENV', 'development');

      Logger.instance = createLogger({
        level: logLevel,
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.errors({ stack: true }),
          format.json(),
        ),
        defaultMeta: { service: 'education-platform' },
        transports: [
          // Write all logs to console
          new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
          }),
          // Write all logs to combined.log
          new transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new transports.File({
            filename: 'logs/combined.log',
          }),
        ],
      });

      // If we're not in production, log to the console with the format:
      if (nodeEnv !== 'production') {
        Logger.instance.add(
          new transports.File({
            filename: 'logs/debug.log',
            level: 'debug',
          }),
        );
      }
    }

    return Logger.instance;
  }
}
