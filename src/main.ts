import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './shared/config'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'
import { TransformInterceptor } from './shared/interceptor/transform.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Tự động loại bỏ các field không được khai báo decorator trong DTO
            forbidNonWhitelisted: true, // Nếu có field không được khai báo decorator trong DTO mà client truyền lên thì sẽ báo lỗi
            transform: true, // Tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (validationErrors) => {
                return new UnprocessableEntityException(
                    validationErrors.map((error) => ({
                        field: error.property,
                        error: Object.values(error.constraints as any).join(', '),
                    })),
                )
            },
        }),
    )
    app.useGlobalInterceptors(new LoggingInterceptor())
    app.useGlobalInterceptors(new TransformInterceptor())

    //swagger
    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, documentFactory)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
