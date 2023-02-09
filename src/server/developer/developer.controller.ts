import {
  Controller,
  Get,
  Post,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { User } from '../user/user.decorator';
import { User as UserType } from '@prisma/client';
import { ApiAuthService } from '../auth/api-auth.service';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';

@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('developer')
export class DeveloperController {
  constructor(private apiAuthService: ApiAuthService) {}

  @Get('')
  @Render('pages/auth/apiCredentials')
  async apiKeys(@User() user: UserType) {
    const creds = await this.apiAuthService.getApiClientsForUser(user);
    return { creds };
  }
  @Post('')
  @Render('pages/auth/apiCredentials')
  async generateApiKeys(@User() user: UserType) {
    const creds = await this.apiAuthService.getApiClientsForUser(user);
    const newCreds = await this.apiAuthService.registerClient(user);
    return { creds, newCreds };
  }
}
