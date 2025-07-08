import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({

      whitelist: true,
      exceptionFactory: (errors) => {

        console.log(errors);
        
        const formattedErrors = errors.map((error) => {          
          const constraints = error.constraints ? Object.values(error.constraints) : [];
          
          return {
            propiedad: error.property,
            errors: constraints,  
          };
        });
  

        throw new BadRequestException({
          statusCode: 400,
          message: 'Errores de validación',
          errors: formattedErrors, 
        });
      },
    })

  );

  await app.listen(5000);
}
bootstrap();
