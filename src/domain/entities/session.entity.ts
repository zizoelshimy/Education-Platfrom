export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly refreshToken: string,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
    public readonly isActive: boolean = true,
    public readonly expiresAt: Date = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ), // 7 days
    public readonly createdAt: Date = new Date(),
    public readonly lastUsedAt: Date = new Date(),
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }

  updateLastUsed(): Session {
    return new Session(
      this.id,
      this.userId,
      this.refreshToken,
      this.userAgent,
      this.ipAddress,
      this.isActive,
      this.expiresAt,
      this.createdAt,
      new Date(),
    );
  }
}
