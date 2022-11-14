import { Controller, Get, Param, Render } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPostsView, BlogPostView } from './types';

@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get(['', 'blog'])
  @Render('pages/blog/index')
  findAll(): BlogPostsView {
    return {
      posts: this.blogService.getBlogPosts(),
    };
  }

  @Get('blog/:id')
  @Render('pages/blog/post')
  findOne(@Param('id') id: string): BlogPostView {
    return {
      post: this.blogService.getBlogPost(id),
    };
  }
}
