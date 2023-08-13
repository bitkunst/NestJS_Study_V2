import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';

async function bootstrap() {
    const app = await NestFactory.create(MessagesModule);
    // if you want to attempt to validate all incoming requests -> apply pipe globally
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}
bootstrap();
