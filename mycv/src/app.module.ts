import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
    /**
     *  @dev
     *  TypeOrmModule.forRoot() : into forRoot(), we're going to pass a configuration object
     *  setting up the connection to the database
     *  connection is going to be automatically shared down into the all other modules inside of our project
     */
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite', // SQLite Database
            database: 'db.sqlite',
            entities: [path.join(__dirname, '**', '*.entity.{ts,js}')], // list out all the different entities or things we want to store inside of our application
            synchronize: true, // true: dev mode
        }),
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

/**
 *  @SQLite
 *  SQLite is a file based database
 *  It's going to store all the information related to your database inside of one single file
 *  VSCode Extension : SQLite
 */

/**
 *  @Synchronize
 *  "synchronize : true" feature is only for use in the development environment
 *  When set to true, it's going to cause TypeORM to take a look at the structure of all your different entities,
 *  and then automatically update the structure of your database
 */
