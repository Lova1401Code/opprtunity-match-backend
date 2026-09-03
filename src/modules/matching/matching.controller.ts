import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/guards/jwt-auth.guard';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matching: MatchingService) {}

  @Get()
  async matchAll(@CurrentUser() user: RequestUser) {
    return this.matching.matchAll(user);
  }

  @Get(':opportunityId')
  async match(@CurrentUser() user: RequestUser, @Param('opportunityId') opportunityId: string) {
    return this.matching.match(user, opportunityId);
  }
}