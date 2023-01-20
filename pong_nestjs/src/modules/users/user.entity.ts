import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string; //사용자 이름.

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string; //메일주소

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string; //비번

    @Column({
        type: DataType.ENUM,
        values: ['male', 'female'],
        allowNull: false,
    })
    gender: string; //성별

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    avatar?: string; //프로필 사진

    @Column({ defaultValue: false })
    is2FAEnabled?: boolean; //2차인증 활성화 여부

    @Column({allowNull: true})
    friendID: number;
}