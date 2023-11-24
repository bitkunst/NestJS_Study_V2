import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entity/user.entity';
import { NotFoundException } from '@nestjs/common';

/**
 *  Whenever we are testing methods inside of a controller,
 *  we don't get the ability to run or make any use of the surrounding decorators
 *  We are testing just the method by itself without any decorators present
 *  If you want to test the decorators, then we have to write out an end-to-end test
 */

describe('UsersController', () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        // only need to implement the methods in these services that are actually used by the controller
        fakeUsersService = {
            findOne: (id: number) => {
                return Promise.resolve({
                    id,
                    email: 'asdf@asdf.com',
                    password: 'asdf',
                } as User);
            },
            find: (email: string) => {
                return Promise.resolve([
                    { id: 1, email, password: 'asdf' } as User,
                ]);
            },
            // remove: () => {},
            // update: () => {},
        };
        fakeAuthService = {
            // signup: () => {},
            signin: (email: string, password: string) => {
                return Promise.resolve({ id: 1, email, password } as User);
            },
        };

        // we can think of this as being an isolated DI container
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService, // whenever someone asks for the UsersService
                    useValue: fakeUsersService, // give them the value fakeUsersService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
            ],
        }).compile();

        controller = module.get(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findAllUsers returns a list of users with the given email', async () => {
        const users = await controller.findAllUsers('asdf@asdf.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('asdf@asdf.com');
    });

    it('findUser returns a single user with the given id', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined();
    });

    it('findUser throws an error if user with given id is not found', async () => {
        fakeUsersService.findOne = () => null;
        await expect(controller.findUser('1')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('signin updates session object and returns user', async () => {
        const session = { userId: 0 };
        const user = await controller.signin(
            {
                email: 'asdf@asdf.com',
                password: 'asdf',
            },
            session,
        );

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });
});
