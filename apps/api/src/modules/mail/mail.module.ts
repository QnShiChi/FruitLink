import { Global, Module } from '@nestjs/common';
import { MailService } from './service/mail.service';
import { MailServiceImpl } from './service/impl/mail.service.impl';

@Global()
@Module({
  providers: [
    {
      provide: MailService,
      useClass: MailServiceImpl,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
