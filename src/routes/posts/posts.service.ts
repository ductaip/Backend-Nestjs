/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostBodyDTO, UpdatePostBodyDTO } from './post.dto'

@Injectable()
export class PostsService {
    constructor(private readonly prismaService: PrismaService) {}
    getPosts(userId: number) {
        // console.log('>>', envConfig.ACCESS_TOKEN_SECRET)

        return this.prismaService.post.findMany({
            where: {
                authorId: userId,
            },
            include: {
                author: {
                    omit: {
                        password: true,
                    },
                },
            },
        })
    }

    createPost(userId: number, body: CreatePostBodyDTO) {
        console.log(userId)
        return this.prismaService.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
            },
            include: {
                author: {
                    omit: {
                        password: true,
                    },
                },
            },
        })
    }

    getPost(postId: number) {
        return this.prismaService.post.findUniqueOrThrow({
            where: {
                id: postId,
            },
            include: {
                author: {
                    omit: {
                        password: true,
                    },
                },
            },
        })
    }

    updatePost(postId: number, body: UpdatePostBodyDTO) {
        return this.prismaService.post.update({
            where: {
                id: postId,
            },
            data: {
                title: body.title,
                content: body.content,
            },
            include: {
                author: true,
            },
        })
    }

    deletePost(id: string) {
        return `Deleted post ${id}`
    }
}
