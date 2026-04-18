import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to your real database before tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to test database');
});

// Clear all data between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect after tests
afterAll(async () => {
  await mongoose.disconnect();
  console.log('✅ Disconnected from test database');
});