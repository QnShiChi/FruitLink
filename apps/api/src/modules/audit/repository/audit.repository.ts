import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuditRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(payload: {
    userId?: string | null;
    action: string;
    targetType: string;
    targetId?: string | null;
    metadata?: Record<string, unknown> | null;
  }) {
    return this.prismaService.auditLog.create({
      data: {
        userId: payload.userId ?? null,
        action: payload.action,
        targetType: payload.targetType,
        targetId: payload.targetId ?? null,
        metadata: (payload.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
