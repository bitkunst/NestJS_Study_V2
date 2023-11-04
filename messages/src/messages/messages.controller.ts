import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    NotFoundException,
} from '@nestjs/common';
/*
    @Controller : class decorator
    @Get , @Post : method decorator
    @Body , @Param : argument decorator
*/
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';
import { Worker } from 'worker_threads';

/*
    To set up a route handler in Nest,
    we're going to define a method inside of a controller
    and then use a decorator on that methods
*/
@Controller('messages')
export class MessagesController {
    constructor(
        public messagesService: MessagesService,
        public messagesService2: MessagesService,
    ) {
        // SHOULD USE DEPENDENCY INJECTION
        console.log('Is Singleton : ', messagesService === messagesService2);
    }

    @Get()
    listMessages() {
        return this.messagesService.findAll();
    }

    /**
     * @dev
     * To extract informations out of an incoming request
     * we're going to use a couple of different decorators
     */
    @Post()
    createMessage(@Body() body: CreateMessageDto) {
        return this.messagesService.create(body.content);
    }

    @Get(':id')
    async getMessage(@Param('id') id: string) {
        const message = await this.messagesService.findOne(id);
        if (!message) throw new NotFoundException('message not found');
        /**
         * There are a couple of errors that Nest defines
         * If you ever throw them during a request cycle then Nest is going to automatically capture that error
         * and turn it into a very nice looking response to send back to the user
         */

        return message;
    }

    // test blocking I/O with worker
    @Get('async')
    async test() {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./dist/messages/worker.js'); // 빌드 후의 경로를 지정
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }
}
