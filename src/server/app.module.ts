import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/application-config';
import { HealthModule } from './health/health.module';
import { BlogModule } from './blog/blog.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { ApiModule } from './api/api.module';
import { SearchModule } from './search/search.module';
import { DocumentModule } from './document/document.module';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IngestModule } from './ingest/ingest.module';
import { RegulatorModule } from './regulator/regulator.module';
import { DeveloperModule } from './developer/developer.module';
import { UnauthorisedModule } from './unauthorised/unauthorised.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SupportingLinksModule } from './supporting-links/supporting-links.module';
import { UploadedDocumentsModule } from './uploaded-documents/uploaded-documents.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit.interceptor';

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
    UnauthorisedModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    SupportingLinksModule,
    UploadedDocumentsModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [Logger],
})
export class AppModule {}
