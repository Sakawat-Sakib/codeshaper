import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Event Management API Documentation')
    .setDescription('This is the documentation for the Event Management API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  app.useGlobalPipes(new ValidationPipe({
    transform: true,  
    whitelist: true,  
    forbidNonWhitelisted: true, 
    transformOptions: {
      enableImplicitConversion: true, 
    },
  }));


  await app.listen(3000);
}
bootstrap();
