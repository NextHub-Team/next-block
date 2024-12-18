import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync } from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Serve static files from the 'public' directory
  app.useStaticAssets(join(__dirname, 'public'));

  // Generate Swagger JSON
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // Swagger UI at '/docs'
  SwaggerModule.setup('/docs', app, document);

  // Serve Swagger JSON for RapiDoc
  const swaggerJsonPath = '/docs/swagger-json';
  app.getHttpAdapter().get(swaggerJsonPath, (_req, res: Response) => {
    res.json(document); // Serve Swagger JSON
  });

  // RapiDoc HTML served from '/docs/rapidoc'
  const filePath = join(__dirname, 'public', 'html', 'rapidoc.html');
  app.getHttpAdapter().get('/docs/rapidoc', (_req, res: Response) => {
    if (!existsSync(filePath)) {
      logger.error(`File not found at: ${filePath}`);
      res.status(404).send('File not found');
      return;
    }
    res.sendFile(filePath);
  });

  // Detect HTTP adapter backbone
  const httpAdapter = app.getHttpAdapter();
  const httpPlatform = httpAdapter.getType(); // Will be 'express' or 'fastify'

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  logger.debug(`Application is running on: ${await app.getUrl()}`);
  logger.debug(`Serving RapiDoc from: ${filePath}`);
  logger.debug(
    `HTTP Backbone: ${httpPlatform === 'express' ? 'Express.js' : 'Fastify'}`,
  );
}

void bootstrap();
