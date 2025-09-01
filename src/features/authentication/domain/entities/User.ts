// Domain Entity: User
// Simplified user entity with direct constructor

export type UserId = string;

export class User {
  constructor(
    public readonly id: UserId,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Computed properties
  get displayName(): string {
    return this.name || this.email.split('@')[0];
  }

  get isActive(): boolean {
    // Consider user active if created within last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return this.createdAt > oneYearAgo;
  }

  // Utility methods
  equals(other: User): boolean {
    return this.id === other.id;
  }
}