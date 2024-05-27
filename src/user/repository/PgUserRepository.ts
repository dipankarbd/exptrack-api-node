import postgres from 'postgres';
import { eq } from 'drizzle-orm';

import {
  CreateUserDto,
  UserResponseDto,
  UserDto,
  UpdatePasswordDto,
} from '../shared/dto';
import { IUserRepository } from './IUserRepository';
import { UserTable, createDB } from '../../db';

export class PgUserRepository implements IUserRepository {
  private readonly db;

  constructor(client: postgres.Sql) {
    this.db = createDB(client);
  }

  async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    const users = await this.db
      .insert(UserTable)
      .values({
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        salt: user.salt,
        hash: user.hash,
      })
      .returning({
        id: UserTable.id,
        role: UserTable.role,
        email: UserTable.email,
        firstName: UserTable.firstName,
        lastName: UserTable.lastName,
      });

    return users[0];
  }

  async getUser(userId: number): Promise<UserDto | undefined> {
    const user = await this.db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
    });

    return user;
  }

  async updatePassword(info: UpdatePasswordDto): Promise<boolean> {
    const users = await this.db
      .update(UserTable)
      .set({ hash: info.hash, salt: info.salt })
      .where(eq(UserTable.id, info.id))
      .returning();

    return users.length > 0;
  }
}
