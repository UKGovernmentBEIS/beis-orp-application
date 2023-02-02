import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(emailAddress: string) {
    const userDomain = emailAddress.split('@')[1];
    const relatedRegulator = await this.prisma.regulator.findUnique({
      where: { domain: userDomain },
    });

    return this.prisma.user.create({
      data: {
        email: emailAddress,
        regulator: relatedRegulator
          ? { connect: { domain: userDomain } }
          : undefined,
      },
    });
  }

  getUserByEmail(emailAddress: string) {
    return this.prisma.user.findUnique({
      where: {
        email: emailAddress,
      },
      include: { regulator: true },
    });
  }

  deleteUser(emailAddress: string) {
    return this.prisma.user.delete({
      where: { email: emailAddress },
    });
  }
}
