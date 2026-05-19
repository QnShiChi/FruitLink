import { Global, Module } from '@nestjs/common';
import { AuditRepository } from './repository/audit.repository';
import { AuditService } from './service/audit.service';
import { AuditServiceImpl } from './service/impl/audit.service.impl';

@Global()
@Module({
  providers: [
    AuditRepository,
    {
      provide: AuditService,
      useClass: AuditServiceImpl,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
