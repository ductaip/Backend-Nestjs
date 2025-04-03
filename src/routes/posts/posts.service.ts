/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostBodyDTO, UpdatePostBodyDTO } from './post.dto'
import { isNotFoundPrismaError } from 'src/shared/helpers'

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

    async getPost(postId: number) {
        try {
            const post = await this.prismaService.post.findUniqueOrThrow({
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
            return post
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new NotFoundException('Post not found')
            }
            throw error
        }
    }

    async updatePost({ postId, userId, body }: { postId: number; body: UpdatePostBodyDTO; userId: number }) {
        try {
            const post = await this.prismaService.post.update({
                where: {
                    id: postId,
                    authorId: userId,
                },
                data: {
                    title: body.title,
                    content: body.content,
                },
                include: {
                    author: {
                        omit: {
                            password: true,
                        },
                    },
                },
            })
            return post
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new NotFoundException('Post not found')
            }
            throw error
        }
    }

    async deletePost({ postId, userId }: { postId: number; userId: number }) {
        console.log(postId, userId)
        try {
            await this.prismaService.post.delete({
                where: {
                    id: postId,
                    authorId: userId,
                },
            })
            return true
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new NotFoundException('Post not found')
            }
            throw error
        }
    }
}
