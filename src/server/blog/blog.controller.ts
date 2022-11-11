import { Controller, Get, Render } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPostView } from './types';

@Controller()
export class BlogController {
  constructor(private readonly appService: BlogService) {}

  @Get()
  @Render('pages/index')
  getBlogPosts(): BlogPostView {
    return {
      posts: this.appService.getBlogPosts(),
    };
  }
}
