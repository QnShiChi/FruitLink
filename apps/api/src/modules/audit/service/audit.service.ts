export abstract class AuditService {
  abstract record(payload: {
    userId?: string | null;
    action: string;
    targetType: string;
    targetId?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<void>;
}
