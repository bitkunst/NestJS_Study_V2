import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log('Route guard');

        // if the ID exists, that is a truthy value
        return request.session.userId;
    }
}
