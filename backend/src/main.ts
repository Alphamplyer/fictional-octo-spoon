import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setupApp(app: INestApplication) {
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
}

function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FOS API')
    .setDescription('The FOS API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}

function getPort(app: INestApplication) {
  const configService = app.get(ConfigService);
  return configService.get('port');
}

async function bootstrap() {
  const logger = new Logger('FOS API');
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  setupSwagger(app);
  const port = getPort(app);
  try {
    await app.listen(port);
    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  } catch (err) {
    logger.error(err);
  }
}

bootstrap();
