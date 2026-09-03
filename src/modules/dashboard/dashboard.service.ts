import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../../infrastructure/mock/mock-database.service';
import { RequestUser } from '../../common/guards/jwt-auth.guard';

@Injectable()
export class DashboardService {
  constructor(private readonly db: MockDatabaseService) {}

  async getStats(user: RequestUser) {
    const userApps = this.db.applications.filter((a) => a.userId === user.id);
    const totalOpportunities = this.db.opportunities.length;
    const totalApplications = userApps.length;

    const byStatus: Record<string, number> = {
      SAVED: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    };
    for (const app of userApps) {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    }

    const u = this.db.users.find((x) => x.id === user.id);
    const userSet = new Set(
      (u?.skills || []).map((s) => s.name.trim().toLowerCase()).filter(Boolean),
    );

    let totalScore = 0;
    let scoredCount = 0;
    const topMatches: { opportunityId: string; title: string; company: string; score: number }[] = [];

    for (const opp of this.db.opportunities) {
      const matched = opp.requiredSkills.filter((r) =>
        userSet.has(r.name.trim().toLowerCase()),
      ).length;
      const total = opp.requiredSkills.length;
      const score = total === 0 ? 0 : Math.round((matched / total) * 100);
      totalScore += score;
      scoredCount++;
      topMatches.push({ opportunityId: opp.id, title: opp.title, company: opp.company, score });
    }

    const averageScore = scoredCount === 0 ? 0 : Math.round(totalScore / scoredCount);
    topMatches.sort((a, b) => b.score - a.score);

    return {
      totalOpportunities,
      totalApplications,
      byStatus,
      averageScore,
      topMatches: topMatches.slice(0, 5),
    };
  }
}