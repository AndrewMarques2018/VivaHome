import type { User } from '@prisma/client';

export class UserEntity {
  id: string;
  email: string;
  name: string;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.googleId = user.googleId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
