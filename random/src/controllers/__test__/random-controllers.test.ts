import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Random } from '../../models/Random';
import { userId } from '../../test/setup';

const baseRandomUrl = '/api/random';
const randomItem = {
  title: 'Something Random',
  createdBy: userId,
};

describe('random controllers', () => {
  describe('add random controller', () => {
    it('returns a 401 when adding a random without authentication', async () => {
      return request(app)
        .post(`${baseRandomUrl}/new`)
        .send(randomItem)
        .expect(401);
    });
    it.todo('validates if user is available in the DB returns a 404 if not');
    it('returns a 400 when a random is added without a title', async () => {
      return request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: '', createdBy: randomItem.createdBy })
        .expect(400);
    });
    it('saves a random to the database sucessfully and returns a 201', async () => {
      let randoms = await Random.find({ createdBy: randomItem.createdBy });
      expect(randoms.length).toEqual(0);
      const newRandom = new Random(randomItem);
      await newRandom.save();
      await request(app)
        .post(`${baseRandomUrl}/new`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send({ title: 'Random Item' })
        .expect(201);
      randoms = await Random.find({ createdBy: randomItem.createdBy });
      expect(randoms.length).toEqual(1);
    });
  });
  describe('get random controller', () => {
    beforeEach(async () => {
      const newRandom = new Random(randomItem);
      await newRandom.save();
    });
    it('returns a 401 when called without authetication', async () => {
      return request(app).get(baseRandomUrl).send().expect(401);
    });
    it('fetches all random items for an authenticated user', async () => {
      const response = await request(app)
        .get(baseRandomUrl)
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send()
        .expect(200);
      expect(response.body.length).toEqual(1);
    });
  });
  describe('get by id random controller', async () => {
    beforeEach(async () => {
      const newRandom = new Random(randomItem);
      await newRandom.save();
    });
    it('returns a 401 when called without authetication', async () => {
      return request(app).get(baseRandomUrl).send().expect(401);
    });
    it('fetches random item by id for an authenticated user', async () => {
      const newRandom = new Random(randomItem);
      await newRandom.save();
      const response = await request(app)
        .get(`${baseRandomUrl}/${newRandom.id}`)
        .set('Authorization', `Bearer ${global.getJwt()}`)
        .send()
        .expect(200);
      expect(response.body.random.title).toEqual(newRandom.title);
    });
  });
  describe('update random controller', () => {});
  describe('delete random controller', () => {});
});
