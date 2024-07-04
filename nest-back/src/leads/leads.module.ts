import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({ timeout: 5000, maxRedirects: 5 }),
    }),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
