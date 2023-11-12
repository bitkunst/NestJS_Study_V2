import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: never, ctx: ExecutionContext) => {
        // data : contain any data or any argument that we provide to our decorator when we actually make use of it
        // whatever we provide to the decorator is going to show up inside the decorator function as this first argument

        // ctx : inspect the incoming request
        // ExecutionContext : it is kind of a wrapper around the incoming request
        // abstract a lof of different incoming kinds of request (a WebSocket incoming message, a gRPC request, a HTTP request)
        const request = ctx.switchToHttp().getRequest();
        return request.currentUser;
    },
);
