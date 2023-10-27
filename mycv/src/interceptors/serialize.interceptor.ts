/**
 * @dev
 * It's going to take an object and then serialize it eventually into Json
 */
import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

// we make use of "implements" anytime that we want to create a new class
// that satisfies all the requirements of either an abstract class or an interface
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(
        context: ExecutionContext,
        handler: CallHandler,
    ): Observable<any> {
        // Run something before a request is handled by the request handler
        // console.log(`I'm running before the handler`, context);

        return handler.handle().pipe(
            map((data: any) => {
                // data argument right here is the data that we're going to send back in the outgoing response
                // Run something before the response is sent out
                // console.log(`I'm running before response is sent out`, data);

                // excludeExtraneousValue: It ensures that whenever we have an instance of user DTO
                // and try to turn it into plain Json, It is only going to share or expose the different properties
                // that are specifically marked with @Expose()
                // So if there are any other properties, they are going to be absolutely removed immediately
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
