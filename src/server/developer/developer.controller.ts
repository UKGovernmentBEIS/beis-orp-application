import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Redirect,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../user/user.decorator';
import { User as UserType } from '../auth/entities/user';
import { ApiAuthService } from '../auth/api-auth.service';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import RemoveApiCredentialsDto from './entities/remove-api-credentials.dto';

@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('developer')
export class DeveloperController {
  constructor(private apiAuthService: ApiAuthService) {}

  @Get('')
  @Header('Cache-Control', 'no-store')
  @Render('pages/developer/')
  async apiKeys(@User() user: UserType) {
    return { creds: await this.apiAuthService.getApiClientsForUser(user) };
  }
  @Post('new-credentials')
  @Header('Cache-Control', 'no-store')
  @Render('pages/developer/newCredentials')
  async generateApiKeys(@User() user: UserType) {
    const newCreds = await this.apiAuthService.registerClient(user);
    return { newCreds };
  }

  @Post('remove-credentials')
  @Header('Cache-Control', 'no-store')
  @Redirect('/developer')
  deleteApiClient(
    @User() user: UserType,
    @Body() removeApiCredentialsDto: RemoveApiCredentialsDto,
  ) {
    return this.apiAuthService.deleteApiClient(
      removeApiCredentialsDto.username,
    );
  }

  @Get('metadata-schema')
  @Render('pages/developer/metadata')
  getSchema() {
    return {};
  }
}
