import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findByUserId(userId: string) {
    return this.prismaService.profile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  updateByUserId(userId: string, payload: { fullName: string; phoneNumber?: string | null }) {
    return this.prismaService.profile.update({
      where: { userId },
      data: {
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber ?? null,
      },
      include: { user: true },
    });
  }
}
