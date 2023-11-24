# Test

<br>

<image width='700px' src='./public/test/testing.png'>

### Unit Testing

-   This is where we take a look at just one class at a time and make sure that every method of that class works as expected

### Integration Testing

-   end to end testing
-   This is where we launch a full copy of our application
-   We make requests to it and we ensure that we get the appropriate response back

<br>
<br>

## How To

-   In order to make testing a lot more straightforward, we're going to use a little trick
-   We're going to use the dependency injection system to avoid having to create all these different dependencies
-   The trick is we are going to `make a fake copy of the service`

<image width='700px' src='./public/test/test_current.png'>
<image width='700px' src='./public/test/test_trick.png'>

<br>

<image width='700px' src='./public/test/di_normal.png'>
<image width='700px' src='./public/test/di_testing.png'>

<br>

```ts
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

it('can create an instance of auth service', async () => {
    //! Create a fake copy of the UsersService
    // we would have TypeScript jump in and try to help make sure that we are defining the methods correctly
    const fakeUsersService: Partial<UsersService> = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) =>
            Promise.resolve({ id: 1, email, password } as User),
    };

    // create temporary testing di container
    const module = await Test.createTestingModule({
        providers: [
            AuthService,
            {
                // pass the fakeUsersService as the UsersService
                provide: UsersService,
                // The property name of provide means "if anyone asks for this"
                useValue: fakeUsersService,
            },
        ],
    }).compile();

    // get a copy of the service
    const service = module.get(AuthService);

    expect(service).toBeDefined();
});
```

<br>

-   `providers` array is a listing of all the different classes that we might want to inject into our DI container
-   Essentially the list of providers is a list of classes we want registered inside the DI container

<image width='700px' src='./public/test/di_providers.png'>

<br>

-   `The property name of provide` means `if anyone asks for this`
    -   if anyone asks for UsersService, give them the value fakeUsersService
    -   we're going to override the actual dependency of UsersService with fake object
-   This entire technique allows us to create a working copy of the AuthService that can make use of other classes, other objects
    -   But we don't have to actually create those other objects or anything like that
    -   Instead we create fake objects and put them into the DI container

<image width='700px' src='./public/test/di_container_testing.png'>

<br>

-   The reason that we are only defining "find()" and "create()" is that those are the only methods that are actually make use of by AuthService

<image width='700px' src='./public/test/fake_service.png'>
