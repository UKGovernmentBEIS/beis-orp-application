import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { mockConfigService } from '../../../test/mocks/config.mock';
import posts from './blog.posts';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('AppController', () => {
  let blogController: BlogController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [BlogService, mockConfigService, mockLogger],
    }).compile();

    blogController = app.get<BlogController>(BlogController);
  });

  describe('findAll', () => {
    it('should return the list of blog posts', () => {
      expect(blogController.findAll().posts).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a blog post', () => {
      const result = blogController.findOne('1');

      expect(result).toEqual({
        post: posts['1'],
        social: {
          email:
            'mailto:?to=&body=https://test.com/blog/1&subject=Making regulation more accessible: Value driven by the ORP',
          facebook:
            'https://www.facebook.com/sharer/sharer.php?u=https://test.com/blog/1',
          linkedIn:
            'https://www.linkedin.com/shareArticle/?url=https://test.com/blog/1&title=Making regulation more accessible: Value driven by the ORP',
          twitter:
            'https://twitter.com/share?text=Making regulation more accessible: Value driven by the ORP&url=https://test.com/blog/1',
        },
      });
    });
  });
});
