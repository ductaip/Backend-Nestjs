import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard'
import { APIKeyGuard } from './guards/api-key.guard'

const sharedServices = [PrismaService, HashingService, TokenService, AccessTokenGuard, APIKeyGuard]
@Global()
@Module({
    providers: sharedServices,
    exports: sharedServices,
    imports: [JwtModule],
})
export class SharedModule {}
