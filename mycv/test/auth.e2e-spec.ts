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

    it('signup as a new user then get the currently logged in user', async () => {
        const email = 'asdf@asdf.com';

        // when we get a cookie back from making this request,
        // we need to temporarily store that cookie
        // "res" is the response that we get back from making this entire request
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: '1234' })
            .expect(201);

        // pulling out the Set-Cookie header,
        // which is where a cookie is usually sent back to us inside of a response
        const cookie = res.get('Set-Cookie');
        // send along this cookie as a header inside the request
        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie)
            .expect(200);

        expect(body.email).toEqual(email);
    });
});
