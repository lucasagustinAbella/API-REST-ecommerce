import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddlwareGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerMiddlwareGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return { property: error.property, constraints: error.constraints };
        });
        return new BadRequestException({
          alert: 'Se han detectado los siguientes errores',
          errors: cleanErrors,
        });
      },
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ecommerce')
    .setDescription(
      'Este proyecto es una API construida utilizando el framework Nest.js, que se basa en TypeScript y proporciona una arquitectura modular y escalable para aplicaciones Node.js. Utiliza TypeORM como ORM (Object-Relational Mapping) para interactuar con la base de datos PostgreSQL.',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
