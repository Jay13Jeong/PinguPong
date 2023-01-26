import { TYPEORM, DEVELOPMENT} from '../constants';
import { databaseConfig } from './database.config';
import { createConnection } from 'typeorm';

export const databaseProviders = [{
   provide: TYPEORM,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
           config = databaseConfig.development;
           break;
        default:
           config = databaseConfig.development;
        }
      await createConnection(config);
      }
}];