import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'

const sharedServices = [PrismaService, HashingService, TokenService]
@Global()
@Module({
    providers: sharedServices,
    exports: sharedServices,
})
export class SharedModule {}
