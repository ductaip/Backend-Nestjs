/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common'
import envConfig from 'src/shared/config'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts() {
    console.log('>>', envConfig.ACCESS_TOKEN_SECRET)

    return this.prismaService.post.findMany()
  }

  createPost(body: any) {
    const userId = 2
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }

  getPost(id: string) {
    return `Post ${id}`
  }

  updatePost(id: string, body: any) {
    return `Update post ${id} with : ${body}`
  }

  deletePost(id: string) {
    return `Deleted post ${id}`
  }
}
