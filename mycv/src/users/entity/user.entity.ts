/**
 *  @dev
 *  these decorators are going to help TypeORM understand some of the different properties that we are going to add to our entity
 */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
} from 'typeorm';
// import { Exclude } from 'class-transformer';

/**
 *  @Entity
 *  @Entity() decorator tells TypeORM that it needs to take a look at this class,
 *  and it needs to create a new table to model this class
 */
@Entity()
export class User {
    /**
     *  @PrimaryGeneratedColumn
     *  @PrimaryGeneratedColumn() decorator is going to be read in by TypeORM,
     *  and it's going to cause TypeORM to take a look at the table and add a new column into it
     *  That column is going to serve as the automatically generated primary key
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     *  @Column
     *  @Column() decorator is going to create a column inside the table
     */
    @Column()
    email: string;

    // @Exclude() // decorator that's going to create little set of rules that describe how to take an instance of a user and turn it into a plain object
    @Column()
    password: string;

    @AfterInsert() // decorator that we can apply to a method defined inside of our entity
    logInsert() {
        // Whenever we insert a new user into our database, this function should be executed
        console.log('Inserted User with id', this.id); // this : reference to the entity that we just inserted
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed User with id', this.id);
    }
}

/**
 *  @hooks
 *  we want to add in a function that's going to log out every operation that we do on a user
 *  One way we can very easily implement this is by using a feature inside of TypeORM called hooks
 *  Hooks allow us to define functions on an entity that will be called automatically at certain points in time
 *  hook decorators : @AfterInsert() , @AfterRemove() , @AfterUpdate()
 */
