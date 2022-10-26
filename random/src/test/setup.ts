import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var getJwt: () => string;
}

export const userId = new mongoose.Types.ObjectId();
let mongo: MongoMemoryServer;

export const loginRoute = '/api/auth/login';

jest.setTimeout(600000);
beforeAll(async () => {
  process.env.JWT_KEY = '=6:$}/N7Hp21HrX[bCiI`xj49xi,_';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getJwt = () => {
  //await await request(app).post(signUpRoute).send(user).expect(201);
  const token = jwt.sign(
    { userId, email: 'test@mail.com' },
    process.env.JWT_KEY!,
    { expiresIn: '1h' }
  );
  return token;
};
