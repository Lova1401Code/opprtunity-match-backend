import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../../infrastructure/mock/mock-database.service';
import { NotFoundError } from '../../common/domain/domain-error';
import { uid, nowIso, sortByCreatedAtDesc, matchSearch, paginate } from '../../common/utils/repo-utils';
import { CreateOpportunityDto, UpdateOpportunityDto } from './dto/opportunity.dto';
import { OpportunityRecord } from '../../infrastructure/mock/seed';
import { RequestUser } from '../../common/guards/jwt-auth.guard';
import { forcedOwnerId } from '../../common/rbac/rbac';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly db: MockDatabaseService) {}

  async findMany(opts: { page?: number; limit?: number; search?: string }) {
    let items = sortByCreatedAtDesc(this.db.opportunities);
    items = matchSearch(items, opts.search || '', ['title', 'company', 'location', 'description'] as (keyof OpportunityRecord)[]);
    const total = items.length;
    const page = opts.page || 1;
    const limit = opts.limit || 20;
    return { items: paginate(items, page, limit).items, total };
  }

  async findOne(id: string): Promise<OpportunityRecord> {
    const opp = this.db.opportunities.find((o) => o.id === id);
    if (!opp) throw new NotFoundError('Opportunité introuvable');
    return opp;
  }

  async create(user: RequestUser, dto: CreateOpportunityDto): Promise<OpportunityRecord> {
    const ts = nowIso();
    const opp: OpportunityRecord = {
      id: uid('opp'),
      title: dto.title,
      company: dto.company,
      description: dto.description,
      url: dto.url || '',
      contractType: dto.contractType,
      location: dto.location,
      workMode: dto.workMode,
      source: dto.source,
      requiredSkills: dto.requiredSkills.map((s) => ({
        name: s.name,
        category: s.category,
      })),
      ownerId: forcedOwnerId(user, user.id),
      createdAt: ts,
      updatedAt: ts,
    };
    this.db.opportunities.push(opp);
    return opp;
  }

  async update(id: string, dto: UpdateOpportunityDto): Promise<OpportunityRecord> {
    const idx = this.db.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundError('Opportunité introuvable');
    const opp = this.db.opportunities[idx];
    const updated: OpportunityRecord = {
      ...opp,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.company !== undefined && { company: dto.company }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.url !== undefined && { url: dto.url }),
      ...(dto.contractType !== undefined && { contractType: dto.contractType }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.workMode !== undefined && { workMode: dto.workMode }),
      ...(dto.source !== undefined && { source: dto.source }),
      ...(dto.requiredSkills !== undefined && {
        requiredSkills: dto.requiredSkills.map((s) => ({ name: s.name, category: s.category })),
      }),
      updatedAt: nowIso(),
    };
    this.db.opportunities[idx] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    const idx = this.db.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundError('Opportunité introuvable');
    this.db.opportunities.splice(idx, 1);
  }
}