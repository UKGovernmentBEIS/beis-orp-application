import { Logger, Module } from '@nestjs/common';
import { UnauthorisedController } from './unauthorised.controller';

@Module({
  controllers: [UnauthorisedController],
  providers: [Logger],
})
export class UnauthorisedModule {}
