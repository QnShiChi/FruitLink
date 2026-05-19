import { Injectable } from '@nestjs/common';
import { AuditRepository } from '../../repository/audit.repository';
import { AuditService } from '../audit.service';

@Injectable()
export class AuditServiceImpl implements AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async record(payload: {
    userId?: string | null;
    action: string;
    targetType: string;
    targetId?: string | null;
    metadata?: Record<string, unknown> | null;
  }) {
    await this.auditRepository.create(payload);
  }
}
