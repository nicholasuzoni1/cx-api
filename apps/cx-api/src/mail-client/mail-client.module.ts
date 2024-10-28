import { Module } from '@nestjs/common';
import { MailClientService } from './mail-client.service';

@Module({
  providers: [MailClientService],
  exports: [MailClientService], // Export it so other modules can use it
})
export class MailClientModule {}
