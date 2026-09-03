import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../../infrastructure/mock/mock-database.service';
import { NotFoundError } from '../../common/domain/domain-error';
import { RequestUser } from '../../common/guards/jwt-auth.guard';

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

@Injectable()
export class MatchingService {
  constructor(private readonly db: MockDatabaseService) {}

  async match(user: RequestUser, opportunityId: string): Promise<MatchResult> {
    const opp = this.db.opportunities.find((o) => o.id === opportunityId);
    if (!opp) throw new NotFoundError('Opportunité introuvable');
    const u = this.db.users.find((x) => x.id === user.id);
    if (!u) throw new NotFoundError('Utilisateur introuvable');

    const userNames = u.skills.map((s) => s.name.trim().toLowerCase()).filter(Boolean);
    const userSet = new Set(userNames);

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of opp.requiredSkills) {
      const name = req.name.trim().toLowerCase();
      if (!name) continue;
      if (userSet.has(name)) matchedSkills.push(req.name);
      else missingSkills.push(req.name);
    }

    const total = opp.requiredSkills.length;
    const score = total === 0 ? 0 : Math.round((matchedSkills.length / total) * 100);

    return { score, matchedSkills, missingSkills };
  }

  async matchAll(user: RequestUser): Promise<{ opportunityId: string; score: number; matchedSkills: string[]; missingSkills: string[] }[]> {
    const u = this.db.users.find((x) => x.id === user.id);
    if (!u) throw new NotFoundError('Utilisateur introuvable');
    const userSet = new Set(u.skills.map((s) => s.name.trim().toLowerCase()).filter(Boolean));

    return this.db.opportunities.map((opp) => {
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];
      for (const req of opp.requiredSkills) {
        const name = req.name.trim().toLowerCase();
        if (!name) continue;
        if (userSet.has(name)) matchedSkills.push(req.name);
        else missingSkills.push(req.name);
      }
      const total = opp.requiredSkills.length;
      const score = total === 0 ? 0 : Math.round((matchedSkills.length / total) * 100);
      return { opportunityId: opp.id, score, matchedSkills, missingSkills };
    });
  }
}