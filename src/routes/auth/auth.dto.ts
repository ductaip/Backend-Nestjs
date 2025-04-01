import { Exclude } from 'class-transformer'
import { Contains, IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDTO {
    @IsString()
    @Contains('abc', { message: 'It must be contain `abc`' })
    email: string

    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string
}

export class LoginResDTO {
    accessToken: string
    refreshToken: string

    constructor(partial: Partial<LoginResDTO>) {
        Object.assign(this, partial)
    }
}

export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString()
    name: string

    @IsString()
    @Match('password')
    confirmPassword: string
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

export class RefreshTokenBodyDTO {
    @IsString()
    refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}

export class LogoutBodyDTO {
    @IsString()
    refreshToken: string
}

export class LogoutResDTO {
    message: string
    constructor(partial: Partial<LogoutResDTO>) {
        Object.assign(this, partial)
    }
}
