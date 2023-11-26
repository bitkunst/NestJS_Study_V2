import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a signup request', () => {
        const signupEmail = 'test1@gmail.com';

        return request(app.getHttpServer())
            .post('/auth/signup') // To send a POST request with a body, first call post() and then call send() right after
            .send({ email: signupEmail, password: 'mypassword' }) // Inside of send(), list out what we want to send inside the POST request
            .expect(201) // chain on a set of expectations
            .then((res) => {
                // then() attaches callbacks for the resolution and/or rejection of the Promise
                // called with a response object
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(signupEmail);
            });
    });
});
