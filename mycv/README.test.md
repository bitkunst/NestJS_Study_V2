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

## Unit testing

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

<br>
<br>

## Integration testing

### e2e test

-   With an end-to-end test, we are attempting to make sure that a lot of different pieces of our application are working together and working as expected
-   So rather than trying to call one single method and make sure that method does the right thing, we're going to instead create an entire copy or an entire instance of our application
-   We're then going to assign that instance to listen to traffic on some random port on your computer
-   Then inside of our test, we're going to make requests to that very temporary server that is listening to traffic

<image width='700px' src='./public/test/e2e_basic.png'>

<br>

-   A brand new copy of our server is going to be created for every separate test we write out
-   We're going to run a test on that server and then shut the entire server down

<image width='700px' src='./public/test/e2e_separate_test.png'>

<br>

-   To run these tests, we're going to run another command from our terminal

```json
// package.json
{
    "scripts": {
        "test:e2e": "jest --config ./test/jest-e2e.json"
    }
}

// jest-e2e.json
{
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "../", // Specifies the root directory where Jest begins searching for test files.
    "modulePaths": ["<rootDir>"], // Set the default path for module resolution.
    // ["<rootDir>"] means resolve modules based on the rootDir setting, which allows you to use absolute paths instead of relative paths.\
    "testEnvironment": "node",
    "testRegex": ".e2e-spec.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
    }
}
```

-   `test:e2e` script is going to run all the end-to-end tests inside ./test directory
-   It's not going to run any of the spec files inside of our ./src folder

<br>

```ts
// app.e2e-spec.ts
describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        // make use of the app module
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        // create a Nest application out of that app module
        app = moduleFixture.createNestApplication();
        await app.init(); // tell that application to start up and start listening for traffic
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer()) // attempting to make a request to our HttpServer
            .get('/') // chain on some different method calls that are going to customize that request
            .expect(200) // eventually make an expectation around the response that comes back
            .expect('Hello World!');
    });
});
```

<br>

### App setup issues

-   **_Issue of having some setup only run during the bootstrap function which does not get executed when our tests are ran_**

<br>

<image width='700px' src='./public/test/e2e_test.png'>

-   During testing we `completely skip over the main.ts file`
-   No code inside the main.ts file is executed in any way
-   Instead, our end-to-end test is importing the app module directly and then creating an app out of the app module

<br>

<image width='700px' src='./public/test/e2e_issue.png'>

-   The only difference here is that `we're going to set these things up globally from within the app module itself`
-   So when the app module is executed, when we create an application out of it, the app module is going to automatically set up the validation pipe and the cookie-session middleware
-   This is a very small and very subtle difference between doing it inside main.ts and inside the app module directly
-   Effectively, it's kind of like almost the same thing. Either way, validation pipe and cookie-session are going to run on every single incoming request. `The only difference is where we are setting them up`

```ts
// app.module.ts
@Module({
    imports: [TypeOrmModule.forRoot({}), UsersModule, ReportsModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            // Whenever we create an instance of our AppModule,
            // automatically take the value of useValue and apply it to every incoming request that flows into our application
            // Global Pipe
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {
    // configure function is going to be called automatically whenever our application starts listening for incoming traffic
    configure(consumer: MiddlewareConsumer) {
        // set up some middleware that will run on every single incoming request
        // Global middleware
        consumer
            .apply(
                cookieSession({
                    keys: ['secret'], // going to be used to encrypt the information that is stored inside the cookie
                }),
            )
            .forRoutes('*');
    }
}
```

<br>

### Solving failures around repeat test runs

<image width='700px' src='./public/test/e2e_repeat.png'>

-   This is going to prevent us from leaking data between our different tests, which might cause one to pass and other to fail, or might cause a test one time to pass but then every subsequent time cause it to fail
-   In addition to `creating a new instance of our app`, which is already occurring inside `beforeEach()` statement, we're also going to either `wipe or recreate the database`

**Be aware of**

-   It might really be worth us trying to have two copies of our database
-   One for our development mode as we are trying to manually test our application
-   And a completely separate database which is only used when we are running our application in testing mode

<image width='700px' src='./public/test/e2e_database.png'>

<br>

-   Two Separate databases
    -   One that will be used for us just actively running our application from the terminal
    -   And then a totally separate database that will be used when we are testing our application using the end-to-end test suite

<image width='700px' src='./public/test/e2e_database_how.png'>

<br>

### dotenv

-   The only goal of this library is to put together a list of different environment variables that exist on your machine
-   It's going to do so by taking a look at all the different `normal environment variables that are defined`,
-   And it's also optionally going to `read in the contents of some file(.env) inside of your project` as well
    -   try to pull some environment configuration from that file
    -   usually by default we call this file `dot env (.env)` file
-   dotenv library is going to read in configuration information from both locations, assemble all that information into a single object and then give it back to us
-   If there's ever any conflict between the environment variables between two locations, then `the normal environment variable on your machine is going to take precedence`

<image width='700px' src='./public/test/dotenv.png'>
<image width='700px' src='./public/test/dotenv_2.png'>

-   The object(\*) that is created by the dotenv library is then going to be exposed to the rest of our application through the `ConfigService`
-   So we're going to use dependency injection to get access to that ConfigService and then use that service to read values out of the object(\*)

```ts
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // use ConfigModule globally
            // we do not have to re-import the ConfigModule all over the place into other modules inside of our project whenever we want to get some config information
            envFilePath: `.env.${process.env.NODE_ENV}`, // put in exactly which files we want to use
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            // Tell DI system that we want to go and find the configuration service which should have all of our config info inside of it from our chosen file
            // And we want to get access to that instance of the ConfigService during the setup of our TypeOrmModule
            useFactory: (config: ConfigService) => {
                return {
                    type: 'sqlite',
                    database: config.get<string>('DB_NAME'),
                    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
                    synchronize: true,
                };
            },
        }),
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

**_ConfigModule_**

-   ConfigModule is what we're going to use to `specify which of different files we actually want to read`

**_ConfigService_**

-   The ConfigService is what is going to `expose the information inside files to the rest of our application`

<br>

```sh
$ npm install cross-env
```

-   cross-env library is all about allowing us to set up different environment variables very easily inside `package.json -> scripts` section that are going to work accross Windows or Mac or something else

```json
{
    "scripts": {
        "start": "cross-env NODE_ENV=development nest start",
        "start:dev": "cross-env NODE_ENV=development nest start --watch",
        "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",

        "test": "cross-env NODE_ENV=test jest",
        "test:watch": "cross-env NODE_ENV=test jest --watch --maxWorkers=1",
        "test:cov": "cross-env NODE_ENV=test jest --coverage",
        "test:debug": "cross-env NODE_ENV=test node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
        "test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json"
    }
}
```

<br>

### SQLite Error issue

-   QueryFailedError: SQLITE_BUSY: database is locked
    -   Jest is trying to run multiple different tests at the exact same time
    -   In general, SQLite does not like to see multiple different connections to it
-   To solve this problem, we're going to tell jest don't try to run our tests in parallel. Just run one test at a time

```sh
# jest option --maxWorkers
## only try to run one spec file at a time
$ --maxWorkers=1
```

```json
{
    "scripts": {
        "test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1"
    }
}
```

<br>

### Jest's test execution process

1. Test environment setup
    - In this step, Jest's test runner is initialized and the test environment(e.g. Node) is set up
    - This environment provides the context in which each test file runs
2. Run `setupFilesAfterEnv`
    - After the test environment is set up, the files specified in the setupFilesAfterEnv option are run
    - At this point the test environment is ready, but before the actual test files are run
    - Here you can configure global settings, configure custom matchers, configure global mocks, etc
3. Run test file
    - After the tasks set in setupFilesAfterEnv are completed, Jest runs the actual test files
    - In this step, test cases (it, test) and test lifecycle methods (beforeEach, afterEach, beforeAll, afterAll) are executed

### jest-e2e.json

```json
// test/jest-e2e.json
{
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "../",
    "modulePaths": ["<rootDir>"],
    "testEnvironment": "node",
    "testRegex": ".e2e-spec.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    "setupFilesAfterEnv": ["<rootDir>/test/setup.ts"]
}
```

-   `setupFilesAfterEnv` : defines a file that's going to be executed right before all of our tests are just about to be executed
    -   Specifies a list of files to be run before the test files are run, but after the test environment is set up.
    -   Global beforeEach()
