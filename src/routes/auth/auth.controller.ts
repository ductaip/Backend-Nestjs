import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDTO, RegisterResDTO } from './auth.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @SerializeOptions({ type: RegisterResDTO })
    @Post('register')
    register(@Body() body: RegisterBodyDTO) {
        // console.log(body)
        return this.authService.register(body)
    }
}
