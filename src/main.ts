import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      exceptionFactory:(e)=>{
        const error= e.map((error)=>{
          return {
            propiedad :error.property,
            error :Object.values(error.constraints)
          }
        })
       throw new BadRequestException(error)
    }
    })
);
  await app.listen(5000);
}
bootstrap();
