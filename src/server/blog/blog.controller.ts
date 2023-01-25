import {
  Controller,
  Get,
  Param,
  Render,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPostsView, BlogPostView } from './types';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';

@UseFilters(new ErrorFilter())
@UseInterceptors(ViewDataInterceptor)
@Controller()
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly config: ConfigService,
  ) {}

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
    const domain = this.config.get('domain');
    const post = this.blogService.getBlogPost(id);
    const address = `${domain}blog/${post.id}`;
    return {
      post,
      social: {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${address}`,
        twitter: `https://twitter.com/share?text=${post.title}&url=${address}`,
        linkedIn: `https://www.linkedin.com/shareArticle/?url=${address}&title=${post.title}`,
        email: `mailto:?to=&body=${address}&subject=${post.title}`,
      },
    };
  }
}
