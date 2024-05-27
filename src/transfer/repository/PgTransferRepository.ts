import postgres from 'postgres';
import {
  CreateTransferRequestDto,
  TransferResponseDto,
  DeleteTransferRequestDto,
} from '../shared/dto';
import { ITransferRepository } from './ITransferRepository';
import {
  AccountTable,
  TransactionTable,
  TransferTable,
  UserTable,
  createDB,
} from '../../db';
import { and, desc, eq, or } from 'drizzle-orm';
import { UnauthorisedError } from '../../account/shared/error';

export class PgTransferRepository implements ITransferRepository {
  private readonly db;

  constructor(client: postgres.Sql) {
    this.db = createDB(client);
  }

  async createTransfer(
    dto: CreateTransferRequestDto,
  ): Promise<TransferResponseDto> {
    const accounts = await this.db
      .select({
        id: AccountTable.id,
      })
      .from(AccountTable)
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(
        and(
          eq(UserTable.id, dto.userId),
          or(
            eq(AccountTable.id, dto.fromAccountId),
            eq(AccountTable.id, dto.toAccountId),
          ),
        ),
      );

    if (accounts.length < 2) {
      throw new UnauthorisedError('Unauthorized');
    }

    return await this.db.transaction(async (tx) => {
      const transfers = await tx
        .insert(TransferTable)
        .values({
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
          amount: dto.amount,
          date: dto.date,
        })
        .returning();

      const balanceRow1 = await tx.query.TransactionTable.findFirst({
        columns: {
          balance: true,
        },
        where: eq(TransactionTable.accountId, dto.fromAccountId),
        orderBy: [desc(TransactionTable.id)],
      });
      const balance1 = balanceRow1?.balance || 0;

      await tx.insert(TransactionTable).values({
        accountId: dto.fromAccountId,
        debit: dto.amount,
        credit: 0,
        balance: balance1 - dto.amount,
        date: new Date(),
        description: `New Transfer - Transaction from account ${dto.fromAccountId}`,
      });

      const balanceRow2 = await tx.query.TransactionTable.findFirst({
        columns: {
          balance: true,
        },
        where: eq(TransactionTable.accountId, dto.toAccountId),
        orderBy: [desc(TransactionTable.id)],
      });
      const balance2 = balanceRow2?.balance || 0;

      await tx.insert(TransactionTable).values({
        accountId: dto.toAccountId,
        debit: 0,
        credit: dto.amount,
        balance: balance2 + dto.amount,
        date: new Date(),
        description: `New Transfer - Transaction to account ${dto.toAccountId}`,
      });

      return transfers[0];
    });
  }

  async deleteTransfer(dto: DeleteTransferRequestDto): Promise<boolean> {
    return await this.db.transaction(async (tx) => {
      const deletedTransfers = await tx
        .delete(TransferTable)
        .where(eq(TransferTable.id, dto.transferId))
        .returning();

      if (deletedTransfers && deletedTransfers.length > 0) {
        const transfer = deletedTransfers[0];

        const lastRow1 = await tx.query.TransactionTable.findFirst({
          columns: {
            balance: true,
          },
          where: eq(TransactionTable.accountId, transfer.fromAccountId),
          orderBy: [desc(TransactionTable.id)],
        });
        const balance1 = lastRow1?.balance || 0;

        await tx.insert(TransactionTable).values({
          accountId: transfer.fromAccountId,
          debit: 0,
          credit: transfer.amount,
          balance: balance1 + transfer.amount,
          date: new Date(),
          description: `Delete Transfer - Transaction from account ${transfer.fromAccountId}`,
        });

        const lastRow2 = await tx.query.TransactionTable.findFirst({
          columns: {
            balance: true,
          },
          where: eq(TransactionTable.accountId, transfer.toAccountId),
          orderBy: [desc(TransactionTable.id)],
        });
        const balance2 = lastRow2?.balance || 0;

        await tx.insert(TransactionTable).values({
          accountId: transfer.toAccountId,
          debit: transfer.amount,
          credit: 0,
          balance: balance2 - transfer.amount,
          date: new Date(),
          description: `Delete Transfer - Transaction to account ${transfer.toAccountId}`,
        });

        return true;
      }

      return false;
    });
  }

  async getTransfers(userId: number): Promise<TransferResponseDto[]> {
    return await this.db
      .select({
        id: TransferTable.id,
        fromAccountId: TransferTable.fromAccountId,
        toAccountId: TransferTable.toAccountId,
        amount: TransferTable.amount,
        date: TransferTable.date,
      })
      .from(TransferTable)
      .innerJoin(AccountTable, eq(AccountTable.id, TransferTable.fromAccountId))
      .innerJoin(UserTable, eq(UserTable.id, AccountTable.userId))
      .where(eq(UserTable.id, userId));
  }
}
