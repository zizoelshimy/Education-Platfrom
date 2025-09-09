export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly bio?: string,
    public readonly avatar?: string,
    public readonly dateOfBirth?: Date,
    public readonly phone?: string,
    public readonly address?: string,
    public readonly website?: string,
    public readonly socialLinks?: SocialLinks,
    public readonly preferences?: UserPreferences,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  isCompleted(): boolean {
    return !!(this.bio && this.avatar && this.dateOfBirth);
  }
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark';
}
