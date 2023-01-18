import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKey, Prisma } from '@prisma/client';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async key(
    apiKeyWhereUniqueInput: Prisma.ApiKeyWhereUniqueInput,
  ): Promise<ApiKey | null> {
    return this.prisma.apiKey.findUnique({
      where: apiKeyWhereUniqueInput,
      include: { regulator: true },
    });
  }
}
