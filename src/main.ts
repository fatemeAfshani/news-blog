import * as config from 'config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = config.get('port');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('News blog')
    .setDescription('The news blog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  logger.log(`app is up and running on port ${port}`);
}
bootstrap();
