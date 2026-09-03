import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../../infrastructure/mock/mock-database.service';
import { PasswordHasherService } from '../../infrastructure/security/password-hasher.service';
import { TokenService } from '../../infrastructure/security/token.service';
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../../common/domain/domain-error';
import { uid, nowIso } from '../../common/utils/repo-utils';
import { UserRecord } from '../../infrastructure/mock/seed';

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  title: string;
  bio: string;
  experienceLevel: string;
  location: string;
  available: boolean;
  preferredContract: string[];
  preferredWorkMode: string[];
  links: Record<string, string | undefined>;
  skills: UserRecord['skills'];
  createdAt: string;
  updatedAt: string;
}

export function toPublicUser(u: UserRecord): PublicUser {
  const { password, ...rest } = u;
  void password;
  return rest;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: MockDatabaseService,
    private readonly hasher: PasswordHasherService,
    private readonly tokens: TokenService,
  ) {}

  async login(email: string, password: string) {
    if (!email || !password) throw new ValidationError('Email et mot de passe requis');
    const user = this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new UnauthorizedError('Identifiants invalides');
    if (user.status === 'DISABLED') throw new UnauthorizedError('Compte désactivé');
    if (!this.hasher.compare(password, user.password)) {
      throw new UnauthorizedError('Identifiants invalides');
    }
    const token = this.tokens.encode({ sub: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  }

  async register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    if (!input.email || !input.password) {
      throw new ValidationError('Email et mot de passe requis');
    }
    const exists = this.db.users.some(
      (u) => u.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (exists) throw new ConflictError('Un compte existe déjà avec cet email.');

    const ts = nowIso();
    const user: UserRecord = {
      id: uid('user'),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: this.hasher.hash(input.password),
      role: 'USER',
      status: 'ACTIVE',
      title: 'Développeur',
      bio: '',
      experienceLevel: 'Junior',
      location: '',
      available: true,
      preferredContract: [],
      preferredWorkMode: [],
      links: {},
      skills: [],
      createdAt: ts,
      updatedAt: ts,
    };
    this.db.users.push(user);
    const token = this.tokens.encode({ sub: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundError('Utilisateur introuvable');
    return toPublicUser(user);
  }

  async logout() {
    return;
  }
}