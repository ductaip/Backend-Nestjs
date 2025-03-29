import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDTO, LoginResDTO, RegisterBodyDTO, RegisterResDTO } from './auth.dto'

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
    async login(@Body() body: LoginBodyDTO) {
        const result = await this.authService.login(body)

        return new LoginResDTO(result)
    }
}
