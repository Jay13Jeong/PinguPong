import * as dotenv from 'dotenv';
import { Users } from 'src/modules/users/user.entity';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_DEVELOPMENT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        type: process.env.DB_DIALECT,
    },
    // test: {
    //     username: process.env.DB_USER,
    //     password: process.env.DB_PASS,
    //     database: process.env.DB_NAME_TEST,
    //     host: process.env.DB_HOST,
    //     port: process.env.DB_PORT,
    //     type: process.env.DB_TYPE,
    // },
    // production: {
    //     username: process.env.DB_USER,
    //     password: process.env.DB_PASS,
    //     database: process.env.DB_NAME_PRODUCTION,
    //     host: process.env.DB_HOST,
    //     type: process.env.DB_TYPE,
    // },
};