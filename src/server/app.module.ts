import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { HealthModule } from './health/health.module';
import { BlogModule } from './blog/blog.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { ApiModule } from './api/api.module';
import { SearchModule } from './search/search.module';
import { DocumentModule } from './document/document.module';
import { DataModule } from './data/data.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IngestModule } from './ingest/ingest.module';
import { RegulatorModule } from './regulator/regulator.module';
import { DeveloperModule } from './developer/developer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    HealthModule,
    BlogModule,
    SubscribeModule,
    ApiModule,
    SearchModule,
    DocumentModule,
    DataModule,
    AuthModule,
    UserModule,
    IngestModule,
    RegulatorModule,
    DeveloperModule,
  ],
  providers: [Logger, PrismaService],
  exports: [Logger],
})
export class AppModule {}
