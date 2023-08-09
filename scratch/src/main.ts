import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

// Add in a function that is going to run anytime we start up our application
async function bootstrap() {
    const app = await NestFactory.create(AppModule); // Create an instance of Nest application

    // Tell this app to start to listen for incoming traffic on a particular port on our computer
    await app.listen(4000);
}

bootstrap();
