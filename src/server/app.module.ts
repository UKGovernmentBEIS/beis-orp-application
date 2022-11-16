import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { HealthModule } from './health/health.module';
import { BlogModule } from './blog/blog.module';
import { SubscribeModule } from './subscribe/subscribe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    HealthModule,
    BlogModule,
    SubscribeModule,
  ],
})
export class AppModule {}
