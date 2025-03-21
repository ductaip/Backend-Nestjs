import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getPosts() {
    return 'All posts';
  }

  createPost(body: any) {
    return body;
  }

  getPost(id: string) {
    return `Post ${id}`;
  }
}
