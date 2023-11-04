import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

/**
 *  @dev
 *  @Injectable() : Register this class to DI Container
 */
@Injectable() // marking this class for registration
export class MessagesRepository {
    async findOne(id: string) {
        const messages = await this.readJSON('messages.json');
        return messages[id];
    }

    async findAll() {
        const messages = await this.readJSON('messages.json');
        return messages;
    }

    async create(content: string) {
        const messages = await this.readJSON('messages.json');

        const id = Math.floor(Math.random() * 999);
        messages[id] = { id, content };
        await writeFile('messages.json', JSON.stringify(messages));
    }

    private async readJSON(path: string) {
        const contents = await readFile(path, 'utf8');
        const json = JSON.parse(contents);
        return json;
    }
}
