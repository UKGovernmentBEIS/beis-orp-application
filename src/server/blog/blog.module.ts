import { Logger, Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

@Module({
  providers: [BlogService, Logger],
  controllers: [BlogController],
})
export class BlogModule {}
