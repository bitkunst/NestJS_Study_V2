import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    // Connect the Entity to its parent module -> this step creates a repository for us
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [
        UsersService,
        AuthService,
        {
            // Set up globally scoped interceptor
            provide: APP_INTERCEPTOR,
            useClass: CurrentUserInterceptor,
        },
    ],
})
export class UsersModule {}
