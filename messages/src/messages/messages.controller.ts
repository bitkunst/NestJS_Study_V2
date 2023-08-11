import { Controller, Get, Post } from '@nestjs/common';
/*
    To set up a route handler in Nest,
    we're going to define a method inside of a controller
    and then use a decorator on that methods
*/
@Controller('messages')
export class MessagesController {
    @Get()
    listMessages() {
        return;
    }

    @Post()
    createMessage() {
        return;
    }

    @Get(':id')
    getMessage() {
        return;
    }
}
