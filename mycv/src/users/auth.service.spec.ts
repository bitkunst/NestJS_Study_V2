import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    // we would have TypeScript jump in and try to help make sure that we are defining the methods correctly
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];

        // fakeUsersService = {
        //     find: () => Promise.resolve([]),
        //     create: (email: string, password: string) =>
        //         Promise.resolve({ id: 1, email, password } as User),
        // };
        // Promise.resolve() is a little helper function that creates a promise and then  immediately resolves it with the given value

        //! Create a fake copy of the UsersService
        fakeUsersService = {
            findOne: () => Promise.resolve({} as User), // In some cases, it's going to be a lot easier
            find: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email,
                );
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 10000),
                    email,
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        };

        // create temporary testing di container
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    // pass the fakeUsersService as the UsersService
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        // get a copy of the service
        service = module.get(AuthService); // cause our di container to create a new instance of the AuthService with all of its different dependencies already initialized
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('qwer@gmail.com', 'mypassword');
        console.log('user', user);

        expect(user.password).not.toEqual('1234');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        // two tests have different requirements of UsersService.find() method
        //* redefine the find() function
        // fakeUsersService.find = () =>
        //     Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await service.signup('asdf@gmail.com', '1234');

        // we need to trace through the execution of code inside of our test suite
        await expect(service.signup('asdf@gmail.com', '1234')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('aa@test.com', '1234')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('throws if an invalid password is provided', async () => {
        // fakeUsersService.find = () =>
        //     Promise.resolve([
        //         { email: 'asdf@gmail.com', password: '0000' } as User,
        //     ]);
        await service.signup('asdf@test.com', '0000');

        await expect(service.signin('asdf@test.com', '1234')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('returns a user if correct password is provided', async () => {
        // fakeUsersService.find = () =>
        //     Promise.resolve([
        //         {
        //             email: 'asdf@gmail.com',
        //             password:
        //                 '058ec8f670f130e9.56ea50c3218be97f9b063c110356975da7b46dcb999063fda8cb1a338ad1499d',
        //         } as User,
        //     ]);
        await service.signup('asdf@gmail.com', 'mypassword');

        const user = await service.signin('asdf@gmail.com', 'mypassword');
        expect(user).toBeDefined();
    });
});
