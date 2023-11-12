import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
/**
 *  @dev
 *  scrypt() - actual hashing function
 *  promisify() - function that will take in a function that makes use of callbacks,
 *      and it's going to give us back a version of that exact same function that instead makes use of promises
 */
// reference our very good promise based version of _script as a variable called scrypt
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // See if email is in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        /* Hash the users password */
        // 1) Generate a salt
        const salt = randomBytes(8).toString('hex'); // generate a random string of numbers and letters
        // 1 byte => 2 characters when we convert it to hex

        // 2) Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // keylen : give us back 32 bytes worth

        // 3) Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');
        console.log('result', result);

        // Create a new user and save it
        const user = await this.usersService.create(email, result);

        // return the user
        return user;
    }

    // authentication step
    signin() {
        return;
    }
}
