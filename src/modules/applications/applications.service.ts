import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../../infrastructure/mock/mock-database.service';
import { NotFoundError, ConflictError } from '../../common/domain/domain-error';
import { uid, nowIso, sortByCreatedAtDesc } from '../../common/utils/repo-utils';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';
import { ApplicationRecord } from '../../infrastructure/mock/seed';
import { RequestUser } from '../../common/guards/jwt-auth.guard';

@Injectable()
export class ApplicationsService {
  constructor(private readonly db: MockDatabaseService) {}

  async findMany(user: RequestUser) {
    const items = sortByCreatedAtDesc(
      this.db.applications.filter((a) => a.userId === user.id),
    );
    return { items, total: items.length };
  }

  async findOne(user: RequestUser, id: string): Promise<ApplicationRecord> {
    const app = this.db.applications.find((a) => a.id === id && a.userId === user.id);
    if (!app) throw new NotFoundError('Candidature introuvable');
    return app;
  }

  async getByOpportunity(user: RequestUser, opportunityId: string): Promise<ApplicationRecord | null> {
    const app = this.db.applications.find(
      (a) => a.opportunityId === opportunityId && a.userId === user.id,
    );
    return app || null;
  }

  async create(user: RequestUser, dto: CreateApplicationDto): Promise<ApplicationRecord> {
    const opp = this.db.opportunities.find((o) => o.id === dto.opportunityId);
    if (!opp) throw new NotFoundError('Opportunité introuvable');

    const existing = this.db.applications.find(
      (a) => a.opportunityId === dto.opportunityId && a.userId === user.id,
    );
    if (existing) throw new ConflictError('Une candidature existe déjà pour cette opportunité.');

    const ts = nowIso();
    const app: ApplicationRecord = {
      id: uid('app'),
      opportunityId: dto.opportunityId,
      userId: user.id,
      status: dto.status || 'SAVED',
      note: dto.note || '',
      createdAt: ts,
      updatedAt: ts,
    };
    this.db.applications.push(app);
    return app;
  }

  async update(user: RequestUser, id: string, dto: UpdateApplicationDto): Promise<ApplicationRecord> {
    const idx = this.db.applications.findIndex((a) => a.id === id && a.userId === user.id);
    if (idx === -1) throw new NotFoundError('Candidature introuvable');
    const app = this.db.applications[idx];
    const updated: ApplicationRecord = {
      ...app,
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.note !== undefined && { note: dto.note }),
      updatedAt: nowIso(),
    };
    this.db.applications[idx] = updated;
    return updated;
  }

  async remove(user: RequestUser, id: string): Promise<void> {
    const idx = this.db.applications.findIndex((a) => a.id === id && a.userId === user.id);
    if (idx === -1) throw new NotFoundError('Candidature introuvable');
    this.db.applications.splice(idx, 1);
  }
}