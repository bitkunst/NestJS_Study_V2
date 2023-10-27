# MyCV - Used Car Pricing API

-   Users sign up with email/password
-   Users get an estimate for how much their car is worth based on the make/model/year/mileage
-   Users can report what they sold their vehicles for
-   Admins have to approve reported sales

<br>

## Routes

### POST /auth/signup

-   Body : { email, password }
-   Description : Create a new user and sign in
-   Controller Method : createUser()
-   Service Method : create()

### GET /auth/:id

-   Description : Find a user with given id
-   Controller Method : findUser()
-   Service Method : findOne()

### GET /auth?email=...

-   Description : Find all users with given email
-   Controller Method : findAllUsers()
-   Service Method : find()

### PATCH /auth/:id

-   Body : { email, password }
-   Description : Update a user with given id
-   Controller Method : updateUser()
-   Service Method : update()

### DELETE /auth/:id

-   Description : Delete user with given id
-   Controller Method : removeUser()
-   Service Method : remove()

### POST /auth/signin

-   Body : { email, password }
-   Description : Sign in as an existing user

### GET /reports

-   QueryString : make, model, year, mileage, longitude, latitude
-   Description : Get an estimate for the cars value

### POST /reports

-   Body : { make, model, year, mileage, longitude, latitude, price }
-   Description : Report how much a vehicle sold for

### PATCH /reports/:id

-   Body : { approved }
-   Description : Approve or reject a report submitted by a user

<br>
<br>

## Modules

-   Create a module for each separate resource
-   and each module can have a controller, a service and a repository to manage that kind of data or that resource

### Users Module

-   Users Controller
-   Users Service
-   Users Repository

### Reports Module

-   Reports Controller
-   Reports Service
-   Reports Repository

<br>
<br>

## Making use of Databases

<image width='600px' src='./public/databases.png'>

<br>

```sh
$ npm install @nestjs/typeorm typeorm sqlite3
```

-   @nestjs/typeorm : library that makes Typeorm and Nest work together very nicely

<br>

<image width='600px' src='./public/typeorm_diagram.png'>

<br>

-   Create connnection to database inside of the AppModule
-   When we do so, that connection is going to be automatically shared and spread throughout all the different modules of our project
-   Entity : an entity is very similar to a model
-   An entity file defines a single kind of resource or a single kind of thing that we want to store inside of our application
-   When we are using TypeORM we do not have to create repository files manually. Instead, repositories are going to be created for us automatically behind the scenes

### Creating an Entity

1. Create an entity file, and create a class in it that lists all the properties that your entity will have
2. Connect the entity to its parent module. This creates a repository
3. Connect the entity to the root connection (in app module)

<br>

### Most SQL ORMs

<image width='500px' src='./public/sql_orm.png'>

### synchronize : true

-   we only make use of the `synchronize : true` feature in a `development environment`
-   we never run that synchronize feature of true in a production environment
-   When we start to move our application into a production environment, we're not going to rely upon that synchronize flag anymore,
-   Instead we're going to write out migration files

<image width='500px' src='./public/synchronize_true.png'>

<br>
<br>

## Repository

-   repositories have a set of methods attached to them that we're going to use to work with data inside of our database
-   create() : create function does not persist or save any information inside of our database. Instead, it takes in some information, creates a new instance of a user entity and then assigns that data.
-   save() : pass the entity off to the save method. The save method is what actually takes an entity and saves it into our database.
-   create() is used to create an instance of an entity, save() is used for actual persistence

<image width='500px' src='./public/repository_api.png'>

-   if we save an entity instance, all the hooks tied to that instance will be executed
-   but if we pass in a plain object and try to save it, no hooks get executed

<image width='500px' src='./public/entity_hooks.png'>

-   Inside TypeORM, there are always more than one way to do something in just about every scenario
-   There are multiple different ways to achieve just about anything you want to do
-   And the difference between these different approaches really comes down to some very fine grained details

<image width='500px' src='./public/repository_api2.png'>

-   save() method saves a given entity in the database. If entity does not exist in the database then inserts, otherwise updates.
-   save() and remove() are designed to work with entity instances
-   insert() and update() are made to be used with plain objects, but no hooks associated with an entity will be executed
-   delete() is designed to work with just a plain "id" or some kind of search criteria
-   if we want to make use of hooks, we're going to rely upon save() and remove()

<image width='500px' src='./public/entity_update.png'>

<br>
<br>

## Validations

```sh
$ npm install class-validator class-transformer
```

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    await app.listen(3000);
}
bootstrap();
```

-   `whitelist` : the purpose of this property is to make sure that incoming requests don't have extraneous properties in the body that we are not expecting
-   By adding in whitelist of true, it's going to make sure that any additional properties that we send along with the request will be stripped out for us automatically

<br>
<br>

## Exceptions

-   Exceptions provided by Nest are not compatible with any other kind of communication protocol
-   If we start throwing Http specific errors from our UsersService, we start to have a kind of tough time reusing this service on future controllers that make use of different communication protocols
-   A very easy thing to do here would be to implement our own exception filter

<image width='500px' src='./public/handle_exceptions.png'>

<br>
<br>

## Excluding Response Properties

### Nest Recommended solution

62 - 3:23

1. Inside of our user entity instance, we're going to make use of a library that's going to attach a very small set of rules on how to take an instance of a user entity and turn it into a plain object and then into Json
2. Set up a decorator that is called a `class serializer interceptor`. An interceptor is a tool inside of Nest that allows us to intercept incoming requests or outgoing reponses and mess around with them in some way

### Custom Interceptor

63 - 2:27

1. No longer going to tie any formatting information or anything around serialization directly to our user entity instance because it's pretty clear that we cannot attach any view related logic to that entity because it's really not going to scale and serve multiple different route handlers appropriately
2. Instead, we are going to create a `custom interceptor`. Remember, an interceptor is a class that's going to mess around in some way with the response before it gets sent back to someone making the request
3. Inside of this custom interceptor, we are going to serialize or turn our user entity instance into a plain object and then eventually into a plain Json by using some serialization rules set up inside of a DTO

### DTOs

-   DTOs in general are not only used for handling incoming data, DTOs are also used for handling the formatting of outgoing data as well
-   we are going to create a User DTO that describes exactly how we want to format a user entity

<br>
<br>

## Interceptors

64 - 1:00

64 - 1:30

-   Inside of our class, the only requirement is that we define a method called specifically `intercept`
-   This method is going to be called automatically anytime our interceptor needs to run. So handle some incoming request or outgoing response

### context

-   Context is essentially a wrapper around some information on the incoming request

### next

-   somewhat like our actual route handler inside of our controller
-   It is not exactly the route handler, it's actually a `rxjs observable`

<br>

65 - 0:58

-   Normally, whenever we finish all of our request handlers, whenever we finish all these interceptors, Nest is going to take whatever comes out of all this stuff and turn it into Json for us
-   So usually user entity instance will be turned into Json, but we're going to kind of hijack that process. We're going to put in an extra step inside there