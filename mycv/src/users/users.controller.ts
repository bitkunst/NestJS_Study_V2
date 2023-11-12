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
    Session, // get us access to entire session object inside of any of our different route handlers
    UseGuards,
    // ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
    SerializeInterceptor,
    Serialize,
} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth') // used as a prefix for all the different route handlers we define inside this class
@Serialize(UserDto) // Wrapping the interceptor in a custom decorator
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    // @Get('whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId);
    // }

    @Get('whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    // @UseInterceptors(ClassSerializerInterceptor)
    // @UseInterceptors(new SerializeInterceptor(UserDto)) // wanted to use specifically UserDto for serialization
    @Get(':id')
    async findUser(@Param('id') id: string) {
        // @Param() decorator can be used to extract some information out of the incoming request
        // Whenever we receive a request, every single part of the URL is a string

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
