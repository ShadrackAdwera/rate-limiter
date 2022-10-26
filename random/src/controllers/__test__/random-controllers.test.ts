import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Random } from '../../models/Random';
import { userId } from '../../test/setup';

const baseRandomUrl = '/api/random';

describe('random controllers', () => {
  describe('add random controller', () => {});
  describe('get random controller', () => {
    beforeEach(async () => {
      const newRandom = new Random({
        title: 'Something Random',
        createdBy: userId,
      });
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
  describe('get by id random controller', () => {});
  describe('update random controller', () => {});
  describe('delete random controller', () => {});
});
