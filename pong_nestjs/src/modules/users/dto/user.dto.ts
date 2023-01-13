import { IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export class UserDto {
    @IsNotEmpty() //validator 유효성 검사 데코. 필드가 비어 있지 않은지 확인.
    readonly name: string;

    @IsNotEmpty()
    @IsEmail() //입력한 이메일이 유효한 이메일 주소인지 확인.
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6) //암호 문자가 6자 이상인지 확인.
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(Gender, { //지정된 값만 허용되는지 확인
        message: 'gender must be either male or female',
    })
    readonly gender: Gender;
}