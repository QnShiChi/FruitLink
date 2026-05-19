import { User } from '@prisma/client';

export abstract class UsersService {
  abstract findByEmail(email: string): Promise<(User & { profile: { fullName: string; phoneNumber: string | null; avatarUrl: string | null } | null }) | null>;
  abstract findById(id: string): Promise<(User & { profile: { fullName: string; phoneNumber: string | null; avatarUrl: string | null } | null }) | null>;
  abstract createInvestorAccount(payload: {
    email: string;
    passwordHash: string;
    fullName: string;
    role: string;
    status: string;
  }): Promise<User & { profile: { fullName: string; phoneNumber: string | null; avatarUrl: string | null } | null }>;
  abstract activateUser(userId: string): Promise<User & { profile: { fullName: string; phoneNumber: string | null; avatarUrl: string | null } | null }>;
  abstract updateStatus(userId: string, status: string): Promise<User & { profile: { fullName: string; phoneNumber: string | null; avatarUrl: string | null } | null }>;
}
