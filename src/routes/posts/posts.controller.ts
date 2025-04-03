import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
// import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostBodyDTO } from './post.dto'
// import { TokenPayload } from 'src/shared/types/jwt.type'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // @UseGuards(AccessTokenGuard)
    // @UseGuards(APIKeyGuard)
    // @UseGuards(AuthenticationGuard)
    @Get()
    getPosts(@ActiveUser('userId') userId: number) {
        return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)))
    }

    @Post()
    @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
    async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {
        console.log('userId', userId)
        return new GetPostItemDTO(await this.postsService.createPost(userId, body))
    }

    @Get(':id')
    async getPost(@Param('id') id: string) {
        const result = await this.postsService.getPost(Number(id))
        console.log('result', result)
        return new GetPostItemDTO(result)
    }

    @Put(':id')
    @Auth([AuthType.Bearer])
    async updatePost(@Param('id') id: string, @Body() body: UpdatePostBodyDTO, @ActiveUser('userId') userId: number) {
        return new GetPostItemDTO(
            await this.postsService.updatePost({
                postId: Number(id),
                userId,
                body,
            }),
        )
    }

    @Delete(':id')
    @Auth([AuthType.Bearer])
    deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
        return this.postsService.deletePost({
            postId: Number(id),
            userId,
        })
    }
}
