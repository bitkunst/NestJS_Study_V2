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

<image width='500px' src='./public/repository_api.png'>

-   Inside TypeORM, there are always more than one way to do something in just about every scenario
-   There are multiple different ways to achieve just about anything you want to do
-   And the difference between these different approaches really comes down to some very fine grained details

<image width='500px' src='./public/repository_api2.png'>

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
