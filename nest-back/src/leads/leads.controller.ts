import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get('all')
  getAllLeads(@Query() query: { query: string }) {
    return this.leadsService.getAllLeads(query.query);
  }
}
