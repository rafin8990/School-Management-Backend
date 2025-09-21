import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import os from 'os';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { swaggerSpec } from './docs/swagger';

import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000', 'http://127.0.0.1:3000', 'http://127.0.0.1:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint for dashboard
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Healthy and Running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// System metrics endpoint for dashboard
app.get('/api/v1/system/metrics', (req: Request, res: Response) => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  res.status(httpStatus.OK).json({
    success: true,
    data: {
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        usagePercent: ((usedMemory / totalMemory) * 100).toFixed(2)
      },
      cpu: {
        cores: os.cpus().length,
        loadAverage: os.loadavg(),
        platform: os.platform(),
        arch: os.arch()
      },
      uptime: {
        system: os.uptime(),
        process: process.uptime()
      },
      node: {
        version: process.version,
        memory: process.memoryUsage(),
        pid: process.pid
      }
    }
  });
});


app.get('/api/v1/docs', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    data: {
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/health',
          description: 'Health check endpoint for system status'
        },
        {
          method: 'GET',
          path: '/api/v1/system/metrics',
          description: 'System metrics and performance data'
        },
        {
          method: 'GET',
          path: '/api/v1/docs',
          description: 'API documentation and available endpoints'
        }
      ]
    }
  });
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
