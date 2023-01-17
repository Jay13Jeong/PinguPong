import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Post } from '../../modules/posts/post.entity';

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => { //동적으로 모듈 만들기.
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
           config = databaseConfig.development;
           break;
        // case TEST:
        //    config = databaseConfig.test;
        //    break;
        // case PRODUCTION:
        //    config = databaseConfig.production;
        //    break;
        default:
           config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([User, Post]); //디비와 소통할 테이블 목록인 인자의 entity목록을 넘김.
        await sequelize.sync();
        return sequelize;
    },
}];