import { Injectable } from '@nestjs/common';
import { BlogPost } from './types';

@Injectable()
export class BlogService {
  getBlogPosts(): BlogPost[] {
    return [
      {
        title: 'Building the Open Regulation Platform',
        author: 'Author',
        date: '4 November 2022',
        tags: [{ name: 'Content tag', href: '#' }],
        description: 'Short description of content - maximum two lines.',
        youtubeId: 'X2juNBpHtaU',
      },
    ];
  }
}
