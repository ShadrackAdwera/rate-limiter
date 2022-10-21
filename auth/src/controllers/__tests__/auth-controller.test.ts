import request from 'supertest';
import { app } from '../../app';

const signUpRoute = '/api/auth/sign-up';

const validUser = {
  email: 'test@mail.com',
  password: '!QAZ@wSX',
};

describe('sign up controller', () => {
  it('should return a 422 on invalid email', async () => {
    return request(app)
      .post(signUpRoute)
      .send({ email: 'testmail.com', password: '123456789' })
      .expect(422);
  });
  it('should return a 422 on short password length', async () => {
    return request(app)
      .post(signUpRoute)
      .send({ email: 'test@mail.com', password: '12345' })
      .expect(422);
  });
  it('should return a 201 on successful sign up', async () => {
    return request(app).post(signUpRoute).send(validUser).expect(201);
  });
  it('should return a 400 when the email exists (login instead)', async () => {
    await request(app).post(signUpRoute).send(validUser).expect(201);
    return request(app).post(signUpRoute).send(validUser).expect(400);
  });
});

describe('login controller', () => {
  beforeEach(async () => {
    return request(app).post(signUpRoute).send(validUser).expect(201);
  });
  it.todo('should return a 422 on invalid email');
  it.todo('should return a 200 on successful login');
  it.todo('should return a 400 when the email does not (sign up instead)');
});
