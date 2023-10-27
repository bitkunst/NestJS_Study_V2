import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    NotFoundException,
    UseInterceptors,
    // ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('auth') // used as a prefix for all the different route handlers we define inside this class
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('signup')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
        return;
    }

    // @UseInterceptors(ClassSerializerInterceptor)
    @UseInterceptors(new SerializeInterceptor(UserDto)) // wanted to use specifically UserDto for serialization
    @Get(':id')
    async findUser(@Param('id') id: string) {
        // @Param() decorator can be used to extract some information out of the incoming request

        console.log('handler is running!');
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) throw new NotFoundException('user not found!');

        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete(':id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
