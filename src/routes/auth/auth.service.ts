import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly prismaService: PrismaService,
        private readonly tokenService: TokenService,
    ) {}

    async register(body: RegisterBodyDTO) {
        try {
            const hashedPassword = await this.hashingService.hash(body.password)

            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name,
                },
            })

            return user
        } catch (error) {
            if (isUniqueConstraintPrismaError(error)) {
                throw new ConflictException('Email already exists')
            }

            throw error
        }
    }

    async login(body: LoginBodyDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email,
            },
        })

        if (!user) {
            throw new UnauthorizedException('User isn`t exist')
        }

        const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

        if (!isPasswordMatch) {
            throw new UnprocessableEntityException([
                {
                    field: 'password',
                    error: 'Password is incorrect',
                },
            ])
        }
        const tokens = await this.generateTokens({ userId: user.id })

        return tokens
    }

    async generateTokens(payload: { userId: number }) {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload),
        ])

        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(decodedRefreshToken.exp * 1000),
            },
        })

        return { accessToken, refreshToken }
    }

    async refreshToken(refreshToken: string) {
        try {
            //1.check that token is invalid/correct
            const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
            //2.check refreshToken is exist on db
            await this.prismaService.refreshToken.findUniqueOrThrow({
                where: {
                    token: refreshToken,
                },
            })

            //3. Delete old refreshToken
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken,
                },
            })

            //4. Create new token
            return this.generateTokens({ userId })
        } catch (error) {
            // the case that refreshToken is done, let notice for users to know their token is lost
            if (isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token has been revoked')
            }
            throw new UnauthorizedException('Maybe refreshToken is expired or invalid')
        }
    }

    async logout(refreshToken: string) {
        try {
            //1.check that token is invalid/correct
            await this.tokenService.verifyRefreshToken(refreshToken)
            //2. Remove refreshToken from db
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken,
                },
            })

            return { message: `Logout successfully` }
        } catch (error) {
            // the case that refreshToken is done, let notice for users to know their token is lost
            if (isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token has been revoked')
            }
            throw new UnauthorizedException('Maybe refreshToken is expired or invalid')
        }
    }
}
