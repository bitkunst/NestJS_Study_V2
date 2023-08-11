# NestJS Scratch

<br>

## packages

```sh
$ npm install @nestjs/common@7.6.17 @nestjs/core@7.6.17 @nestjs/platform-express@7.6.17 reflect-metadata@0.1.13 typescript@4.3.2
```

### @nestjs/common

-   Contains vast majority of functions, classes, etc, that we need from Nest

### @nestjs/platform-express

-   Let Nest use ExpressJS for handling HTTP requests
-   Internally, Nest itself does not handle incoming requests
-   Nest relies upon some outside implementation to handle HTTP requests for it
-   We have to plug-in some kind of HTTP implementation. We have to provide some kind of server that says here is something that's going to handle incoming requests and then eventually respond to them with an outgoing response
-   @nestjs/platform-express : an adaptor between Express and Nest.

<image width="450px" height="300px" src="./public/nest_server.png" />

### reflect-metadata

-   Helps make decorators work.

### typescript

-   We write Nest apps with Typescript

<br>
<br>

## Tools

<image width="600px" height="200px" src="./public/request_response.png" />

-   `Pipe` : Validate data contained in the request
-   `Guard` : Make sure the user is authenticated
-   `Controller` : Route the request to a particular function
-   `Service` : Run some business logic
-   `Repository` : Access a database

### Parts of Nest

<image width="500px" height="500px" src="./public/parts_of_nest.png">

<br>
<br>

## Request Lifecycle

1. Incoming request
2. Globally bound middleware
3. Module bound middleware
4. Global guards
5. Controller guards
6. Route guards
7. Global interceptors (pre-controller)
8. Controller interceptors (pre-controller)
9. Route interceptors (pre-controller)
10. Global pipes
11. Controller pipes
12. Route pipes
13. Route parameter pipes
14. Controller (method handler)
15. Service (if exists)
16. Route interceptor (post-request)
17. Controller interceptor (post-request)
18. Global interceptor (post-request)
19. Exception filters (route, then controller, then global)
20. Server response
