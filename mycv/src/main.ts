import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import cookieSession from 'cookie-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.use(
    //     cookieSession({
    //         keys: ['secret'], // going to be used to encrypt the information that is stored inside the cookie
    //     }),
    // );

    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         whitelist: true,
    //     }),
    // );
    await app.listen(3000);
}
bootstrap();
