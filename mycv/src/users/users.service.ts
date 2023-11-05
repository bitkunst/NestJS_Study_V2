import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    /**
     *
     *  @param repo
     *  Repository<User> : repo is going to be an instance of a TypeORM repository that deals with instances of User
     *  @InjectRepository(User) : This is what is going to tell the dependency injection system that we need the User repository
     *  The dependency injection system uses type annotation to figure out what instance it needs to inject into class at runtime
     *  Unfortunately, Dependency Injection System does not play nicely with generics
     *  So @InjectRepository(User) decorator is required simply because we have to use a generic type
     */
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        // create a new instance of a user inside of our application code -> get back an instance of user entity
        const user = this.repo.create({ email, password });
        // save() : what is going to actually saves user entity to the database
        // we can call the save() method with any kind of object that has the properties that a user should have
        // this.repo.save({ email, password })
        // ! then why do we bother first creating an instance of the user entity??
        // there are some scenarios in which we might want to put in some validation logic inside of an Entity class -> @IsEmail()
        // we can tie our validation logic directly to an Entity as opposed to the incoming DTO
        // if we did that, then before we saved our user off into our database, we would want to make sure that we actually ran that validation
        // * so if we wanted to run that validation, we would first have to create an instance of our User
        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({ id }); // return one record or null
    }

    find(email: string) {
        return this.repo.find({ where: { email } }); // return an array of all the different records that match that search criteria
        // if we find no results, we'll get back an empty array
    }

    // ! Partial<T> : Make all properties in T optional
    // this Partial type helper tells us that "attrs" can be any object that has at least or none, some of the properties of the User class
    async update(id: number, attrs: Partial<User>) {
        // twice the work just to get hooks to run
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('user not found!');

        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        // return this.repo.delete(id); -> single trip to the database, but no hooks executed
        // twice the work just to get hooks to run
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('user not found!');

        return this.repo.remove(user);
    }
}
