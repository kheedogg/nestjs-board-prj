import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = config.get<number>('server.port');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Test')
    .setDescription('NestJS Board App API Description')
    .setVersion('1.0')
    .addTag('boards')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, documentFactory());

  await app.listen(port);

}
bootstrap();
