import { Exclude } from 'class-transformer'
import { Contains, IsString, MinLength } from 'class-validator'

export class LoginBodyDTO {
    @IsString()
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

export class RegisterResDTO {
    email: string
    @Exclude() password: string
    name: string
    description: string

    constructor(partial: Partial<RegisterResDTO>) {
        Object.assign(this, partial)
    }
}
