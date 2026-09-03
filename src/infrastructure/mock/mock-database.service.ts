import { Injectable, OnModuleInit } from '@nestjs/common';
import { buildSeed, SeedData } from './seed';

@Injectable()
export class MockDatabaseService implements OnModuleInit {
  private data!: SeedData;

  async onModuleInit() {
    await this.reset();
  }

  async reset(): Promise<void> {
    this.data = await buildSeed();
  }

  get users() { return this.data.users; }
  get opportunities() { return this.data.opportunities; }
  get applications() { return this.data.applications; }

  snapshot(): SeedData {
    return this.data;
  }
}