import { IsString, MinLength } from 'class-validator'

export class LoginBodyDTO {
    @IsString()
    email: string

    @IsString()
    password: string
}

export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString()
    name: string

    @IsString()
    @MinLength(10)
    description: string
}
