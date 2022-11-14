import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPost } from './types';
import BlogPosts from './blog.posts';

@Injectable()
export class BlogService {
  getBlogPosts(): BlogPost[] {
    return Object.values(BlogPosts);
  }

  getBlogPost(id): BlogPost {
    const post = BlogPosts[id];
    if (!post) throw new NotFoundException(`No blog post matching id ${id}`);
    return post;
  }
}
