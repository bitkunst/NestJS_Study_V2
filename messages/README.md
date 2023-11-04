# About Application

-   Store and retrieve messages stored in a plain JSON file

<br>

## Nest-CLI

-   Nest CLI can create different kinds of class files for us and put a little bit of starter code inside them

```sh
# generate module
$ nest g mo messages
# generate controller [place the file in the messages directory]/[call the class 'messages']
$ nest g co messages/messages --flat
```

### options

-   `--flat` : Don't create an extra folder called "controllers"

<br>

<image width="600px" src="./public/nest-cli.png">

<br>
<br>

## VSCode REST Client Extension

-   install REST Client Extension
-   make a file like `[fileName].http`
-   we can create a new file and then inside that file we can write out some configuration for different requests that we want to make to our API
-   it's kind of built in documentation that you can include with your source code

<br>
<br>

## HTTP Request

<image width="600px" height="250px" src="./public/http_request.png">

<br>

<image width="600px" height="280px" src="./public/http_request_decorators.png">

<br>
<br>

## DTO

<image width="600px" height="250px" src="./public/dto.png">

-   goal of a dto is to carry informations or carry data between two places frequently in the form of network request
-   `Data transfer objects usually do not have any kind of functionality tied to them`. They are simple classes. They list out a couple of different properties.
-   Think of "data transfer object" as being a `very clear description of what some form of data looks like`, as it is being sent along inside of a request

<br>
<br>

## Validation Rules

```sh
$ npm install class-validator class-transformer
```

<image width="600px" height="200px" src="./public/pipe.png">

-   `ValidationPipe` : Pipe built-in to Nest to make validation super easy
-   set up ValidationPipe at main.ts file (global pipe)
-   if you want to attempt to validate all incoming requests -> apply pipe globally
-   But this doesn't mean we need to add in validation rules to every single route handler. The validation pipe is very intelligent and if we don't add in some validation rules to some particular handler, the validation pipe won't run on it.

```ts
async function bootstrap() {
    const app = await NestFactory.create(MessagesModule);
    // if you want to attempt to validate all incoming requests -> apply pipe globally
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}
```

### Setting Up Automatic Validation

-   all we have to do to set up automatic validation for a particular request handler

1. Tell Nest to use global validation (main.ts -> app.useGlobalPipes())
2. Create a class that describes the different properties that the request body should have (Data Transfer Object; DTO)
3. Add validation rules to the class (library: class-validator)
4. Apply that class to the request handler

### class-transformer & class-validator

-   class-transformer is a simple package that `takes a plain object and converts it into an instance of a class`
-   [class-transformer github](https://github.com/typestack/class-transformer)
-   class-validator handles validation of properties on an instance of a class by using decorators
-   [class-validator github](https://github.com/typestack/class-validator)

<image width="800px" height="270px" src="./public/validation_pipe.png">

-   Internally, validation pipe makes use of class-transformer and class-validator to do all of these validations automatically

```json
// tsconfig.json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true, // allows type information to make it from typescript to javascript
        "experimentalDecorators": true
    }
}
```

-   `emitDecoratorMetadata` : if you have "emitDecoratorMetadata" option set to "true", a very small amount of type annotations and information will make it over to JavaScript

<br>
<br>

## Service & Repository

<image width="500px" height="270px" src="./public/messages_app.png">

<image width="600px" height="300px" src="./public/service_repository.png">

### Service

-   create a service anytime we want to write out some kind of `business logic`
-   something to run some kind of calculation or stuff like that
-   also make use of services anytime that we want to `fetch data from a repository`
-   service is going to frequently use one or more repositories to find and store data
-   services behave as `sort of like a proxy that sits in front of repositories`

### Repository

-   repositories are where we are going to write out any kind of `storage related logic`
-   if we need to directly interact with the database
-   if we need to write information into a file
-   repositories usually end up being kind of like a wrapper around some other storage library

<br>

<image width="600px" src="./public/service_repository_method.png">

<br>
<br>

## IoC & DI

### IoC (Inversion of Control) Principle

-   If you follow this principle, it might be a little bit easier to build reusable code or write reusable code
-   `Classes should not create instances of its dependencies on its own`
-   Bad example
    -   not following Inversion of Control <br>
        <image width="500px" height="350px" src="./public/ioc_bad.png">
-   Better example
    -   whenever we create an instance of MessagesService, we would pass in a copy, an already existing copy of the MessagesRepository
    -   so we create a repository ahead of time, and whenever we want a service we're going to pass it into the service
    -   `downside` : MessagesService always relies upon specifically a copy of MessagesRepository being passed into the constructor. So we always have to create specifically MessagesRepositoy <br>
        <image width="500px" height="350px" src="./public/ioc_better.png" >
-   Best example

    -   rather than specifically wanting to get a copy of MessagesRepository, we have instead `defined an interface` called simply Repository
    -   do not rely upon getting exactly the MessagesRepository
    -   instead, our code can work perfectly fine as long as you pass it any object that satisfies Repository interface <br>
        <image width="500px" height="550px" src="./public/ioc_best.png" >

-   When we have our code set up with an `interface`, as opposed to a very direct reference to some other class, we can start to do really interesting things
-   Make MessagesService easier to test and possibly more usable <br>

<image width="600px" height="350px" src="./public/ioc_why.png" >

```ts
// make use of Inversion of Control
const repo = new MessagesRepository();
const service = new MessagesService(repo);
const controller = new MessagesController(service);
```

### DI (Dependency Injection)

-   `Dependency Injection is all about making use of Inversion of Control`, but not having to create a ton of different classes or a ton of different instances every single time
-   we can continue to use idea of Inversion of Control, but we don't have to worry about creating all dependencies ourselves
-   DI Container is going to take care of that for us
-   Even though the Container does exist inside of our application, we rarely directly interact with it in any way
-   Instead, we just make use of some decorators, we add somethings to the module and then Nest is going to take care of everything else itself automatically

<image width="600px" height="300px" src="./public/di_container.png">

<image width="600px" height="350px" src="./public/di_container_flow.png">

-   In general, for every class we create that is not a controller, generally `services and repositories` we're going to add on `@Injectable()` decorator and add that class to our modules list of `providers`
-   Then everything else is going to happen automatically. Nest is going to automatically create the container for us. It will automatically create the controllers for us as well. And the controllers will get all the appropriate dependencies.
