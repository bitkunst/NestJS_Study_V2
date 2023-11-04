import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

/**
 *  @dev
 *  By @Injecatable() decorator we can add this class to DI Container
 *  Marking this class for registration inside the DI Container
 *  Registration process is going to occur automatically
 */
@Injectable()
export class MessagesService {
    //! Typescript syntactic sugar
    //! arguments are going to be automatically assigned as properties to the class
    constructor(public messagesRepo: MessagesRepository) {
        // we do not have any class create its own dependencies inside of a constructor
        // Instead, we're going to use Dependency Injection (DI) to set up dependencies between different classes
        // The dependency injection system uses type annotation to figure out what instance it needs to inject into class at runtime
    }

    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    findAll() {
        return this.messagesRepo.findAll();
    }

    create(content: string) {
        return this.messagesRepo.create(content);
    }
}
