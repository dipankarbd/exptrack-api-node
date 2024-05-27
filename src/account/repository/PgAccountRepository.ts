import postgres from 'postgres';
import {
  AccountResponseDto,
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
} from '../shared/dto';
import { IAccountRepository } from './IAccountRepository';
import { AccountTable, TransactionTable, UserTable, createDB } from '../../db';
import { and, desc, eq } from 'drizzle-orm';
import { UnauthorisedError } from '../shared/error';

export class PgAccountRepository implements IAccountRepository {
  private readonly db;

  constructor(client: postgres.Sql) {
    this.db = createDB(client);
  }

  async getAccounts(userId: number): Promise<AccountResponseDto[]> {
    const accounts = await this.db.query.AccountTable.findMany({
      where: eq(AccountTable.userId, userId),
    });

    return await Promise.all(
      accounts.map(async (acc: any) => await this.mapAccountToResponseDto(acc)),
    );
  }

  async createAccount(
    dto: CreateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    return await this.db.transaction(async (tx) => {
      const accounts = await tx
        .insert(AccountTable)
        .values({
          userId: dto.userId,
          type: dto.accountType,
          state: 'Active',
          name: dto.name,
          initialAmount: dto.initialAmount,
          createdAt: new Date(),
        })
        .returning();

      const lastRow = await tx.query.TransactionTable.findFirst({
        columns: {
          balance: true,
        },
        where: eq(TransactionTable.accountId, accounts[0].id),
        orderBy: [desc(TransactionTable.id)],
      });
      const balance = lastRow?.balance || 0;

      await tx.insert(TransactionTable).values({
        accountId: accounts[0].id,
        debit: 0,
        credit: dto.initialAmount,
        balance: balance + dto.initialAmount,
        date: new Date(),
        description: 'Account Creation',
      });

      return await this.mapAccountToResponseDto(accounts[0]);
    });
  }

  async updateAccount(
    dto: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto | null> {
    const accounts = await this.db
      .select({
        id: AccountTable.id,
        name: AccountTable.name,
        type: AccountTable.type,
        state: AccountTable.state,
        initialAmount: AccountTable.initialAmount,
      })
      .from(AccountTable)
      .innerJoin(UserTable, eq(AccountTable.userId, UserTable.id))
      .where(and(eq(UserTable.id, dto.userId), eq(AccountTable.id, dto.id)));

    if (accounts === null || (accounts && accounts.length === 0)) {
      throw new UnauthorisedError('Unauthorized');
    }

    const account = accounts[0];

    return await this.db.transaction(async (tx) => {
      if (account) {
        if (account.initialAmount !== dto.initialAmount) {
          const transcationLastRow = await tx.query.TransactionTable.findFirst({
            columns: {
              balance: true,
            },
            where: eq(TransactionTable.accountId, account.id),
            orderBy: [desc(TransactionTable.id)],
          });
          const balance = transcationLastRow?.balance || 0;

          await tx.insert(TransactionTable).values([
            {
              accountId: account.id,
              debit: account.initialAmount,
              credit: 0,
              balance: balance - account.initialAmount,
              date: new Date(),
              description: 'Account Update',
            },
            {
              accountId: account.id,
              debit: 0,
              credit: dto.initialAmount,
              balance: balance - account.initialAmount + dto.initialAmount,
              date: new Date(),
              description: 'Account Update',
            },
          ]);
        }

        const updatedAccounts = await tx
          .update(AccountTable)
          .set({
            id: dto.id,
            name: dto.name,
            type: dto.accountType,
            state: dto.accountState,
            initialAmount: dto.initialAmount,
          })
          .where(eq(AccountTable.id, dto.id))
          .returning();

        return await this.mapAccountToResponseDto(updatedAccounts[0]);
      }

      return null;
    });
  }

  private async mapAccountToResponseDto(
    account: any,
  ): Promise<AccountResponseDto> {
    return {
      id: account.id,
      name: account.name,
      accountType: account.type,
      accountState: account.state,
      initialAmount: account.initialAmount,
      currentBalance: await this.getAccountBalance(account.id),
    };
  }

  private async getAccountBalance(id: number): Promise<number> {
    const transactionlastRow = await this.db.query.TransactionTable.findFirst({
      columns: {
        balance: true,
      },
      where: eq(TransactionTable.accountId, id),
      orderBy: [desc(TransactionTable.id)],
    });

    return transactionlastRow?.balance || 0;
  }
}
