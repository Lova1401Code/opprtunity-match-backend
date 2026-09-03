import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, SkillDto, UpdateSkillDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/guards/jwt-auth.guard';
import { PublicUser } from '../auth/auth.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get()
  async me(@CurrentUser() user: RequestUser): Promise<PublicUser> {
    return this.profile.getProfile(user.id);
  }

  @Get(':userId')
  async get(@Param('userId') userId: string): Promise<PublicUser> {
    return this.profile.getProfile(userId);
  }

  @Patch()
  async update(@CurrentUser() user: RequestUser, @Body() dto: UpdateProfileDto): Promise<PublicUser> {
    return this.profile.updateProfile(user.id, dto);
  }

  @Post('skills')
  async addSkill(@CurrentUser() user: RequestUser, @Body() dto: SkillDto): Promise<PublicUser> {
    return this.profile.addSkill(user.id, dto);
  }

  @Patch('skills/:skillId')
  async updateSkill(
    @CurrentUser() user: RequestUser,
    @Param('skillId') skillId: string,
    @Body() dto: UpdateSkillDto,
  ): Promise<PublicUser> {
    return this.profile.updateSkill(user.id, skillId, dto);
  }

  @Delete('skills/:skillId')
  async removeSkill(
    @CurrentUser() user: RequestUser,
    @Param('skillId') skillId: string,
  ): Promise<PublicUser> {
    return this.profile.removeSkill(user.id, skillId);
  }
}