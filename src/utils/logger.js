import winston from 'winston';
import { serverConfig } from '../config/server-config.js';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: serverConfig.logLevel,
  format: logFormat,
  defaultMeta: { service: 'webrtc-server' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add file transports only in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ 
    filename: '/var/log/webrtc/error.log',
    level: 'error'
  }));
  logger.add(new winston.transports.File({ 
    filename: '/var/log/webrtc/combined.log'
  }));
}

export { logger };