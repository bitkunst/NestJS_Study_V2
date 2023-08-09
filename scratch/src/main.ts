import { Controller, Module, Get } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// this decorator is telling Nest that
// we are trying to create a class that is going to serve as a controller inside of our application
@Controller()
class AppController {
    // Each method is designed to handle one kind of incoming request
    /*
        @Get() decorator allows us to create route handlers that respond to incoming
        requests that have a HTTP method of GET.
    */
    @Get()
    getRootRoute() {
        return 'hi there!';
    }
}

/*
    When we make use of the @Module() decorators,
    we are expected to pass a configuration option or object to it.
*/
@Module({
    controllers: [AppController],
})
class AppModule {}
// Whenever our application starts up Nest is going to look at this AppModule
// and find all the controllers that are listed up

// Add in a function that is going to run anytime we start up our application
async function bootstrap() {
    const app = await NestFactory.create(AppModule); // Create an instance of Nest application

    // Tell this app to start to listen for incoming traffic on a particular port on our computer
    await app.listen(4000);
}

bootstrap();
