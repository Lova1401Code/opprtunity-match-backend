import { RequestUser } from '../guards/jwt-auth.guard';
import { UnauthorizedError } from '../domain/domain-error';

export function isAdmin(user: RequestUser): boolean {
  return user.role === 'ADMIN';
}

export function enforceOwnership(user: RequestUser, ownerId: string | null | undefined): void {
  if (isAdmin(user)) return;
  if (ownerId !== user.id) {
    throw new UnauthorizedError('Accès refusé : vous ne possédez pas cette ressource', true);
  }
}

export function ownerFilter(user: RequestUser): { ownerId?: string } | undefined {
  if (isAdmin(user)) return undefined;
  return { ownerId: user.id };
}

export function forcedOwnerId(user: RequestUser, incoming?: string | null): string {
  if (isAdmin(user)) return incoming ?? user.id;
  return user.id;
}