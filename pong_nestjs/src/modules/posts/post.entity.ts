import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Post extends Model<Post> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string; //제목 컬럼.

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    body: string; //내용 컬럼

    @ForeignKey(() => User) //외래키 설정. userid와 User테이블의 id와 연결.
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number; //작성자 아이디.

    @BelongsTo(() => User) //User테이블과 연결.
    user: User;
}