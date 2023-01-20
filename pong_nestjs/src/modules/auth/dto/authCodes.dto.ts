import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class authCodesDto {
    @IsString()
    @IsNotEmpty()
    code:string;
    @IsString()
    @IsOptional()
    twoFactorAuth: string;
}
