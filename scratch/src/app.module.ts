import { Module } from '@nestjs/common';
import AppController from './app.controller';

/*
    When we make use of the @Module() decorators,
    we are expected to pass a configuration option or object to it.
*/
@Module({
    controllers: [AppController],
})
class AppModule {}
// Whenever our application starts up,
// Nest is going to look at this AppModule and find all the controllers that are listed up
// It's going to automatically create an instance of all of our different controller classes

export default AppModule;
