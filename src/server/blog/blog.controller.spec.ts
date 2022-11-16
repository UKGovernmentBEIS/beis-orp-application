import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

describe('AppController', () => {
  let blogController: BlogController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [BlogService],
    }).compile();

    blogController = app.get<BlogController>(BlogController);
  });

  describe('root', () => {
    it('should return the list of blog posts', () => {
      expect(blogController.findAll().posts).toHaveLength(1);
    });
  });
});
