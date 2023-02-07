import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Regulator } from '@prisma/client';

@Injectable()
export class RegulatorService {
  constructor(private prisma: PrismaService) {}

  getRegulatorByEmail(emailAddress: string): Promise<Regulator | null> {
    const domain = emailAddress.split('@')[1];
    if (!domain) return null;
    return this.prisma.regulator.findUnique({
      where: {
        domain: domain,
      },
    });
  }
}
