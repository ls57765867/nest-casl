import { IsNotEmpty, IsString, Length } from 'class-validator'
export interface signinDto {
    username: string
    password: string
}

export class SigninDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {
        message: `用户名长度必须在$constraint1和$constraint2之间,当前传递的值是: $value`,
    })
    username: string

    @IsString()
    @IsNotEmpty()
    @Length(4, 20, { message: `密码长度必须在$constraint1和$constraint2之间,当前传递的值是: $value` })
    password: string
}

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {
        message: `用户名长度必须在$constraint1和$constraint2之间,当前传递的值是: $value`,
    })
    username: string

    @IsString()
    @IsNotEmpty()
    @Length(4, 20, { message: `密码长度必须在$constraint1和$constraint2之间,当前传递的值是: $value` })
    password: string
}
