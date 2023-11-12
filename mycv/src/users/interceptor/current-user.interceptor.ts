import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable() // to make use of dependency injection at all
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        console.log('CurrentUserInterceptor running before the handler!');
        // ExecutionContext: it's like a wrapper around the incoming request
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = await this.usersService.findOne(userId);
            // take the user we found and assign it to the request object
            request.currentUser = user;
            // the request object can be retrieved or we can get access to that object inside of our decorator
        }

        // just continue on
        // just go ahead and run the actual route handler
        return handler.handle();
    }
}
