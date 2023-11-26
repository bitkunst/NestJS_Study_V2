import { rm } from 'fs/promises';
import { join } from 'path';

// setup Global beforeEach()
global.beforeEach(async () => {
    // this function is going to be executed before every single test across all of our different spec files
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (error) {}
});
