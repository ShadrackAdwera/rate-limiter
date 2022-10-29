import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Random, User } from '../../models/Random';
import { userId } from '../../test/setup';

const baseRandomUrl = '/api/random';
const randomItem = {
  title: 'Something Random',
};

describe('random controllers', () => {
  beforeEach(async () => {
    const newUser = new User({ _id: userId, email: 'test@mail.com' });
    await newUser.save();
  });
  describe('add random controller', () => {
    it('returns a 401 when adding a random without authentication', async () => {
      return request(app)
        .post(`${baseRandomUrl}/new`)
        .send(randomItem)
        .expect(401);
    });
    it.todo('validates if user is available in the DB returns a 404 if not');
    it('returns a 422 when a random is added without a title', async () => {
      return request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: '' })
        .expect(422);
    });
    it('saves a random to the database sucessfully and returns a 201', async () => {
      let randoms = await Random.find();
      expect(randoms.length).toEqual(0);
      await request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: 'Random Item' })
        .expect(201);
      randoms = await Random.find();
      expect(randoms.length).toEqual(1);
    });
  });
  describe('get random controller', () => {
    beforeEach(async () => {
      await request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: 'Random Item' })
        .expect(201);
    });
    it.todo('validates if user is available in the DB returns a 404 if not');
    it('returns a 401 when called without authetication', async () => {
      return request(app).get(baseRandomUrl).send().expect(401);
    });
    it('fetches all random items for an authenticated user', async () => {
      const response = await request(app)
        .get(baseRandomUrl)
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send()
        .expect(200);
      expect(response.body.randoms.length).toEqual(1);
    });
  });
  describe('get by id random controller', () => {
    beforeEach(async () => {
      await request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: 'Random Item' })
        .expect(201);
    });
    it.todo('validates if user is available in the DB returns a 404 if not');
    it('returns a 404 if random with the id provided is not found', async () => {
      const itemId = new mongoose.Types.ObjectId();
      return request(app)
        .get(`${baseRandomUrl}/${itemId}`)
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({})
        .expect(404);
    });
    it('returns a 401 when called without authetication', async () => {
      return request(app).get(baseRandomUrl).send().expect(401);
    });
    it('fetches random item by id for an authenticated user', async () => {
      const created = await request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: 'Random Item' })
        .expect(201);
      const response = await request(app)
        .get(`${baseRandomUrl}/${created.body.random.id}`)
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send()
        .expect(200);
      expect(response.body.random.title).toEqual('Random Item');
    });
  });
  describe('update random controller', () => {
    it.todo('validates if user is available in the DB returns a 404 if not');
  });
  describe('delete random controller', () => {
    it.todo('validates if user is available in the DB returns a 404 if not');
  });
});
