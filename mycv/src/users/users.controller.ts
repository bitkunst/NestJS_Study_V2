import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth') // used as a prefix for all the different route handlers we define inside this class
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('signup')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
        return;
    }
}
