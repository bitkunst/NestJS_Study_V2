import { Controller, Get } from '@nestjs/common';

/*
    this decorator is telling Nest that 
    we are trying to create a class that is going to serve as a controller inside of our application
*/
// any route put inside @Controller() decorator is going to apply to all the route handlers that we define inside of this controller
@Controller('app')
class AppController {
    // Each method is designed to handle one kind of incoming request
    /*
        @Get() decorator allows us to create route handlers that respond to incoming
        requests that have a HTTP method of GET.
    */
    @Get('/root') // respond to GET request to a route of "/root"
    getRootRoute() {
        return 'hi there!';
    }

    @Get('/bye')
    getByeThere() {
        return 'bye there!';
    }
}

export default AppController;
