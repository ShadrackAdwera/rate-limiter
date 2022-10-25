import request from 'supertest';
import { app } from '../../app';
import { loginRoute } from '../../test/setup';

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
  it('should return a 422 on invalid email', async () => {
    return request(app)
      .post(loginRoute)
      .send({ email: 'testingmail.com', password: '1qazwsxda' })
      .expect(422);
  });
  it('should return a 200 on successful login', async () => {
    return request(app)
      .post(loginRoute)
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);
  });
  it.todo(
    'should return a 404 when the email does not exist (sign up instead)',
    async () => {
      return request(app)
        .post(loginRoute)
        .send({ email: 'testing-err@mail.com', password: '123wesdxca' })
        .expect(404);
    }
  );
});
