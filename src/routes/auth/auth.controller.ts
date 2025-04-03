import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
    LoginBodyDTO,
    LoginResDTO,
    LogoutBodyDTO,
    LogoutResDTO,
    RefreshTokenBodyDTO,
    RefreshTokenResDTO,
    RegisterBodyDTO,
    RegisterResDTO,
} from './auth.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @SerializeOptions({ type: RegisterResDTO })
    @Post('register')
    async register(@Body() body: RegisterBodyDTO) {
        const result = await this.authService.register(body)

        return new RegisterResDTO(result)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginBodyDTO) {
        const result = await this.authService.login(body)
        return new LoginResDTO(result)
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: RefreshTokenBodyDTO) {
        return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
    }

    @Post('logout')
    async logout(@Body() body: LogoutBodyDTO) {
        return new LogoutResDTO(await this.authService.logout(body.refreshToken))
    }
}
