import postgres from 'postgres';
import {
  ExpenseCategoryResponseDto,
  CreateExpenseRequestDto,
  ExpenseResponseDto,
  DeleteExpenseRequestDto,
  UpdateExpenseRequestDto,
} from '../shared/dto';
import { IExpenseRepository } from './IExpenseRepository';
import {
  AccountTable,
  ExpenseTable,
  TransactionTable,
  UserTable,
  createDB,
} from '../../db';
import { and, desc, eq } from 'drizzle-orm';
import { UnauthorisedError } from '../../account/shared/error';

export class PgExpenseRepository implements IExpenseRepository {
  private readonly db;
  private categories: ExpenseCategoryResponseDto[] = [];

  constructor(client: postgres.Sql) {
    this.db = createDB(client);
  }

  async getCategories(): Promise<ExpenseCategoryResponseDto[]> {
    return await this.db.query.ExpenseCategoryTable.findMany();
  }

  async getExpenses(userId: number): Promise<ExpenseResponseDto[]> {
    const expenses = await this.db
      .select({
        id: ExpenseTable.id,
        categoryId: ExpenseTable.categoryId,
        accountId: ExpenseTable.accountId,
        amount: ExpenseTable.amount,
        date: ExpenseTable.date,
      })
      .from(ExpenseTable)
      .innerJoin(AccountTable, eq(AccountTable.id, ExpenseTable.accountId))
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(eq(UserTable.id, userId));

    return await Promise.all(
      expenses.map(async (acc: any) => await this.mapToExpenseResponseDto(acc)),
    );
  }

  async createExpense(
    dto: CreateExpenseRequestDto,
  ): Promise<ExpenseResponseDto> {
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
      const expenses = await tx
        .insert(ExpenseTable)
        .values({
          categoryId: dto.categoryId,
          accountId: dto.accountId,
          amount: dto.amount,
          date: dto.date,
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
        debit: dto.amount,
        credit: 0,
        balance: balance - dto.amount,
        date: new Date(),
        description: `New Expense - ${await this.getExpenseCategoryName(dto.categoryId)}`,
      });

      return await this.mapToExpenseResponseDto(expenses[0]);
    });
  }

  async deleteExpense(dto: DeleteExpenseRequestDto): Promise<boolean> {
    const expenses = await this.db
      .select({
        expenseId: ExpenseTable.id,
      })
      .from(ExpenseTable)
      .innerJoin(AccountTable, eq(AccountTable.id, ExpenseTable.accountId))
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(
        and(eq(UserTable.id, dto.userId), eq(ExpenseTable.id, dto.expenseId)),
      );

    if (expenses.length === 0) {
      throw new UnauthorisedError('Unauthorized');
    }

    return await this.db.transaction(async (tx) => {
      const deletedExpenses = await tx
        .delete(ExpenseTable)
        .where(eq(ExpenseTable.id, dto.expenseId))
        .returning();

      if (deletedExpenses && deletedExpenses.length > 0) {
        const expense = deletedExpenses[0];

        const lastRow = await tx.query.TransactionTable.findFirst({
          columns: {
            balance: true,
          },
          where: eq(TransactionTable.accountId, expense.accountId),
          orderBy: [desc(TransactionTable.id)],
        });
        const balance = lastRow?.balance || 0;

        await tx.insert(TransactionTable).values({
          accountId: expense.accountId,
          debit: 0,
          credit: expense.amount,
          balance: balance + expense.amount,
          date: new Date(),
          description: `Deleted Expense - ${await this.getExpenseCategoryName(expense.categoryId)}`,
        });

        return true;
      }

      return false;
    });
  }

  async updateExpense(
    dto: UpdateExpenseRequestDto,
  ): Promise<ExpenseResponseDto | null> {
    const expenses = await this.db
      .select({
        expenseId: ExpenseTable.id,
      })
      .from(ExpenseTable)
      .innerJoin(AccountTable, eq(AccountTable.id, ExpenseTable.accountId))
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(
        and(
          eq(UserTable.id, dto.userId),
          eq(ExpenseTable.id, dto.id),
          eq(AccountTable.id, dto.accountId),
        ),
      );

    if (expenses.length === 0) {
      throw new UnauthorisedError('Unauthorized');
    }

    return await this.db.transaction(async (tx) => {
      const expense = await tx.query.ExpenseTable.findFirst({
        where: eq(ExpenseTable.id, dto.id),
      });

      if (expense) {
        const lastTransactionRow = await tx.query.TransactionTable.findFirst({
          columns: {
            balance: true,
          },
          where: eq(TransactionTable.accountId, dto.accountId),
          orderBy: [desc(TransactionTable.id)],
        });
        const balance = lastTransactionRow?.balance || 0;

        await tx.insert(TransactionTable).values([
          {
            accountId: expense.accountId,
            debit: 0,
            credit: expense.amount,
            balance: balance + expense.amount,
            date: new Date(),
            description: `Delete Expense - ${await this.getExpenseCategoryName(expense.categoryId)}`,
          },
          {
            accountId: dto.accountId,
            debit: dto.amount,
            credit: 0,
            balance: balance + expense.amount - dto.amount,
            date: new Date(),
            description: `New Expense - ${await this.getExpenseCategoryName(dto.categoryId)}`,
          },
        ]);

        const updatedExpenses = await tx
          .update(ExpenseTable)
          .set({
            categoryId: dto.categoryId,
            accountId: dto.accountId,
            amount: dto.amount,
            date: dto.date,
          })
          .where(eq(ExpenseTable.id, dto.id))
          .returning();

        return await this.mapToExpenseResponseDto(updatedExpenses[0]);
      }

      return null;
    });
  }

  private async mapToExpenseResponseDto(
    expense: any,
  ): Promise<ExpenseResponseDto> {
    const categoryTitle = await this.getExpenseCategoryName(expense.categoryId);
    return {
      id: expense.id,
      categoryId: expense.categoryId,
      categoryTitle: categoryTitle,
      accountId: expense.accountId,
      amount: expense.amount,
      date: expense.date,
    };
  }

  private async getExpenseCategoryName(categoryId: number): Promise<string> {
    if (this.categories.length <= 0) {
      this.categories = await this.getCategories();
    }

    const expenseCaterory = this.categories.find(
      (cat: any) => cat.id === categoryId,
    );

    if (expenseCaterory === undefined) return 'Unknown';

    if (expenseCaterory.parentId) {
      return (
        (await this.getExpenseCategoryName(expenseCaterory.parentId)) +
        '/' +
        expenseCaterory.name
      );
    }

    return expenseCaterory.name;
  }
}
