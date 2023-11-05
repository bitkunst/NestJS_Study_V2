/**
 *  @dev
 *  It's going to take an object and then serialize it eventually into Json
 */
import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// interface for any class
interface ClassConstructor {
    new (...args: any[]): object;
}

// * Custom decorator
// pass in the dto that we want to use for serialization
export function Serialize(dto: ClassConstructor) {
    // Wrapping the Interceptor in a Decorator
    return UseInterceptors(new SerializeInterceptor(dto));
}

// we make use of "implements" anytime that we want to create a new class
// that satisfies all the requirements of either an abstract class or an interface
export class SerializeInterceptor implements NestInterceptor {
    // * receive DTO and save it as a property to our class
    // we'll use this DTO anytime that we need to run our serialization logic
    constructor(private dto: any) {}

    intercept(
        context: ExecutionContext,
        handler: CallHandler,
    ): Observable<any> {
        // * Run something before a request is handled by the request handler
        console.log(`I'm running before the handler`);

        return handler.handle().pipe(
            map((data: any) => {
                // data argument right here is the data that we're going to send back in the outgoing response
                // * Run something before the response is sent out
                console.log(`I'm running before response is sent out`);

                // * excludeExtraneousValues: true
                // It ensures that whenever we have an instance of user DTO
                // and try to turn it into plain Json, It is only going to share or expose the different properties
                // that are specifically marked with @Expose()
                // So if there are any other properties, they are going to be absolutely removed immediately
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
