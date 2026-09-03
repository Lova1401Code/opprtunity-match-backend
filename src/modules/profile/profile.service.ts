import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../../infrastructure/mock/mock-database.service';
import { NotFoundError } from '../../common/domain/domain-error';
import { uid, nowIso } from '../../common/utils/repo-utils';
import { toPublicUser, PublicUser } from '../auth/auth.service';
import { UpdateProfileDto, SkillDto, UpdateSkillDto } from './dto/profile.dto';
import { SkillRecord } from '../../infrastructure/mock/seed';

@Injectable()
export class ProfileService {
  constructor(private readonly db: MockDatabaseService) {}

  async getProfile(userId: string): Promise<PublicUser> {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundError('Utilisateur introuvable');
    return toPublicUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<PublicUser> {
    const idx = this.db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new NotFoundError('Utilisateur introuvable');
    const user = this.db.users[idx];
    const links = { ...user.links };
    if (dto.portfolio !== undefined) links.portfolio = dto.portfolio || undefined;
    if (dto.github !== undefined) links.github = dto.github || undefined;
    if (dto.linkedin !== undefined) links.linkedin = dto.linkedin || undefined;

    const updated = {
      ...user,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.experienceLevel !== undefined && { experienceLevel: dto.experienceLevel }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.available !== undefined && { available: dto.available }),
      ...(dto.preferredContract !== undefined && { preferredContract: dto.preferredContract }),
      ...(dto.preferredWorkMode !== undefined && { preferredWorkMode: dto.preferredWorkMode }),
      links,
      updatedAt: nowIso(),
    };
    this.db.users[idx] = updated;
    return toPublicUser(updated);
  }

  async addSkill(userId: string, dto: SkillDto): Promise<PublicUser> {
    const idx = this.db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new NotFoundError('Utilisateur introuvable');
    const skill: SkillRecord = {
      id: uid('skill'),
      name: dto.name,
      category: dto.category,
      level: dto.level,
    };
    this.db.users[idx].skills.push(skill);
    this.db.users[idx].updatedAt = nowIso();
    return toPublicUser(this.db.users[idx]);
  }

  async updateSkill(userId: string, skillId: string, dto: UpdateSkillDto): Promise<PublicUser> {
    const idx = this.db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new NotFoundError('Utilisateur introuvable');
    const skillIdx = this.db.users[idx].skills.findIndex((s) => s.id === skillId);
    if (skillIdx === -1) throw new NotFoundError('Compétence introuvable');
    const skill = this.db.users[idx].skills[skillIdx];
    this.db.users[idx].skills[skillIdx] = {
      ...skill,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.level !== undefined && { level: dto.level }),
    };
    this.db.users[idx].updatedAt = nowIso();
    return toPublicUser(this.db.users[idx]);
  }

  async removeSkill(userId: string, skillId: string): Promise<PublicUser> {
    const idx = this.db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new NotFoundError('Utilisateur introuvable');
    this.db.users[idx].skills = this.db.users[idx].skills.filter((s) => s.id !== skillId);
    this.db.users[idx].updatedAt = nowIso();
    return toPublicUser(this.db.users[idx]);
  }
}