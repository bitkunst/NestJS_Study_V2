import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    /**
     *
     * @param repo
     * Repository<User> : repo is going to be an instance of a TypeORM repository that deals with instances of User
     * @InjectRepository(User) : This is what is going to tell the dependency injection system that we need the User repository
     * Dependency Injection system does not play nicely with generics
     * So @InjectRepository(User) decorator is required simply because we have to use a generic type
     */
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });

        return this.repo.save(user);
    }
}
