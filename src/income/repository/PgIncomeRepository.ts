import postgres from 'postgres';
import {
  CreateIncomeRequestDto,
  IncomeResponseDto,
  DeleteIncomeRequestDto,
} from '../shared/dto';
import { IIncomeRepository } from './IIncomeRepository';
import {
  AccountTable,
  IncomeTable,
  TransactionTable,
  UserTable,
  createDB,
} from '../../db';
import { and, desc, eq } from 'drizzle-orm';
import { UnauthorisedError } from '../../account/shared/error';

export class PgIncomeRepository implements IIncomeRepository {
  private readonly db;

  constructor(client: postgres.Sql) {
    this.db = createDB(client);
  }

  async createIncome(dto: CreateIncomeRequestDto): Promise<IncomeResponseDto> {
    const accounts = await this.db
      .select({
        id: AccountTable.id,
      })
      .from(AccountTable)
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(
        and(eq(UserTable.id, dto.userId), eq(AccountTable.id, dto.accountId)),
      );

    if (accounts.length === 0) {
      throw new UnauthorisedError('Unauthorized');
    }

    return await this.db.transaction(async (tx) => {
      const incomes = await tx
        .insert(IncomeTable)
        .values({
          accountId: dto.accountId,
          amount: dto.amount,
          date: dto.date,
          source: dto.source,
        })
        .returning();

      const balanceRow = await tx.query.TransactionTable.findFirst({
        columns: {
          balance: true,
        },
        where: eq(TransactionTable.accountId, dto.accountId),
        orderBy: [desc(TransactionTable.id)],
      });
      const balance = balanceRow?.balance || 0;

      await tx.insert(TransactionTable).values({
        accountId: dto.accountId,
        debit: 0,
        credit: dto.amount,
        balance: balance + dto.amount,
        date: new Date(),
        description: `New Income - ${dto.source} to account ${dto.accountId}`,
      });

      return await incomes[0];
    });
  }

  async deleteIncome(dto: DeleteIncomeRequestDto): Promise<boolean> {
    const incomes = await this.db
      .select({
        id: IncomeTable.id,
      })
      .from(IncomeTable)
      .innerJoin(AccountTable, eq(AccountTable.id, IncomeTable.accountId))
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(
        and(eq(UserTable.id, dto.userId), eq(IncomeTable.id, dto.incomeId)),
      );

    if (incomes.length === 0) {
      throw new UnauthorisedError('Unauthorized');
    }

    return await this.db.transaction(async (tx) => {
      const deletedIncomes = await tx
        .delete(IncomeTable)
        .where(eq(IncomeTable.id, dto.incomeId))
        .returning();

      if (deletedIncomes && deletedIncomes.length > 0) {
        const income = deletedIncomes[0];

        const lastRow = await tx.query.TransactionTable.findFirst({
          columns: {
            balance: true,
          },
          where: eq(TransactionTable.accountId, income.accountId),
          orderBy: [desc(TransactionTable.id)],
        });
        const balance = lastRow?.balance || 0;

        await tx.insert(TransactionTable).values({
          accountId: income.accountId,
          debit: income.amount,
          credit: 0,
          balance: balance - income.amount,
          date: new Date(),
          description: `Delete Income - ${income.source} to account ${income.accountId}`,
        });

        return true;
      }

      return false;
    });
  }

  async getIncomes(userId: number): Promise<IncomeResponseDto[]> {
    return await this.db
      .select({
        id: IncomeTable.id,
        accountId: IncomeTable.accountId,
        amount: IncomeTable.amount,
        date: IncomeTable.date,
        source: IncomeTable.source,
      })
      .from(IncomeTable)
      .innerJoin(AccountTable, eq(AccountTable.id, IncomeTable.accountId))
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(eq(UserTable.id, userId));
  }
}
