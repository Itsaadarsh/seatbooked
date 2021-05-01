import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
jest.mock('../natsInstance.ts');
beforeAll(async () => {
  process.env.JWT_TOKEN = '123';
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const getAllCollection = await mongoose.connection.db.collections();
  getAllCollection.forEach(async collection => {
    await collection.deleteMany({});
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
