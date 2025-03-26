import { Contains, IsString, MinLength } from 'class-validator'

export class LoginBodyDTO {
    @IsString()
    @MinLength(10, { message: `That's wrong bro` })
    @Contains('abc', { message: 'It must be contain `abc`' })
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
