import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { APIDocs } from './common/api-docs/api-docs.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from './common/logger/logger.service';
import { LoggerExceptionFilter } from './common/logger/logger-exception.filter';
import { RabbitMQRegister } from './communication/rabbitMQ/rabbitmq.register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.useGlobalFilters(new LoggerExceptionFilter(app.get(LoggerService)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

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
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  await APIDocs.setup(app, options); // doesnt need use swagger SwaggerModule.setup
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  await APIDocs.info(app);
  app.enableCors(); // <- Allow all CORS requests (default)
  app.enableShutdownHooks();
  RabbitMQRegister.init(app);
  await app.startAllMicroservices();
}
void bootstrap();
