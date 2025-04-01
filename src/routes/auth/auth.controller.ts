import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
    LoginBodyDTO,
    LoginResDTO,
    RefreshTokenBodyDTO,
    RefreshTokenResDTO,
    RegisterBodyDTO,
    RegisterResDTO,
} from './auth.dto'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @SerializeOptions({ type: RegisterResDTO })
    @Post('register')
    async register(@Body() body: RegisterBodyDTO) {
        // console.log('register controller :....')
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
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: RefreshTokenBodyDTO) {
        return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
    }
}
