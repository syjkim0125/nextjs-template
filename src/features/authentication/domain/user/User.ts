// Domain Entity: User
// Pure user entity with business logic only

export type UserId = string;

export class User {
  constructor(
    public readonly id: UserId,
    public readonly name: string,
    public readonly email: string
  ) {}

  // Computed properties - Domain business logic
  get displayName(): string {
    return this.name || this.email.split('@')[0];
  }

  get avatarUrl(): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.displayName)}&background=6366f1&color=fff`;
  }

  // Domain methods
  equals(other: User): boolean {
    return this.id === other.id;
  }
}