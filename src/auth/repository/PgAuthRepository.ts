import postgres from 'postgres';
import { eq } from 'drizzle-orm';

import { UserDto } from '../shared/dto';
import { IAuthRepository } from './IAuthRepository';
import { UserTable, createDB } from '../../db';

export class PgAuthRepository implements IAuthRepository {
  private readonly db;

  constructor(client: postgres.Sql) {
    this.db = createDB(client);
  }

  async getUserByEmail(email: string): Promise<UserDto | undefined> {
    const user = await this.db.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
    });

    return user;
  }

  async getUser(userId: number): Promise<UserDto | undefined> {
    const user = await this.db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
    });

    return user;
  }
}
