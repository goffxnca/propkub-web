import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      return {
        uri,
        ...options
      };
    }
  });

export const closeMongodConnection = async () => {
  if (mongod) {
    await mongod.stop();
  }
};
