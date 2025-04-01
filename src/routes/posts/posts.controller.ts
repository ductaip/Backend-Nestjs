import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { PostsService } from './posts.service'
// import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Request } from 'express'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // @UseGuards(AccessTokenGuard)
    // @UseGuards(APIKeyGuard)
    // @UseGuards(AuthenticationGuard)
    @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
    @Get()
    getPosts() {
        return this.postsService.getPosts()
    }

    @Post()
    @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
    createPost(@Body() body: any, @Req() request: Request) {
        console.log(request.headers['x-api-key'])
        console.log(request.headers['authorization'])
        return this.postsService.createPost(body)
    }

    @Get(':id')
    getPost(@Param('id') id: string) {
        return this.postsService.getPost(id)
    }

    @Put(':id')
    updatePost(@Param('id') id: string, @Body() body: any) {
        return this.postsService.updatePost(id, body)
    }

    @Delete(':id')
    deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id)
    }
}
