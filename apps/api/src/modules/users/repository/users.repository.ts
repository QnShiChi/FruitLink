import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  createInvestorUser(payload: {
    email: string;
    passwordHash: string;
    fullName: string;
    role: string;
    status: string;
  }) {
    return this.prismaService.user.create({
      data: {
        email: payload.email,
        passwordHash: payload.passwordHash,
        role: payload.role,
        status: payload.status,
        profile: {
          create: {
            fullName: payload.fullName,
          },
        },
      },
      include: { profile: true },
    });
  }

  activateUser(userId: string) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        status: 'active',
        emailVerifiedAt: new Date(),
      },
      include: { profile: true },
    });
  }

  updateStatus(userId: string, status: string) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { status },
      include: { profile: true },
    });
  }
}
