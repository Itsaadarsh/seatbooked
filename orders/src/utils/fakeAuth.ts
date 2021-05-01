import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const fakeAuth = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_TOKEN!);
  const session = JSON.stringify({ token });
  const base64Encoding = Buffer.from(session).toString('base64');
  return [`express:sess=${base64Encoding}`];
};

export default fakeAuth;
