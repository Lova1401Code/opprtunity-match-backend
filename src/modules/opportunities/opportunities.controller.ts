import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto, UpdateOpportunityDto } from './dto/opportunity.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('opportunities')
@UseGuards(JwtAuthGuard)
export class OpportunitiesController {
  constructor(private readonly svc: OpportunitiesService) {}

  @Get()
  async list(@Query() q: PaginationDto) {
    return this.svc.findMany({ page: q.page, limit: q.limit, search: q.search });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateOpportunityDto) {
    return this.svc.create(user, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.svc.remove(id);
    return;
  }
}