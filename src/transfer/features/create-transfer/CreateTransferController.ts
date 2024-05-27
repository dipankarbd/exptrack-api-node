import { Request, Response } from 'express';
import { CreateTransferUseCase } from './CreateTransferUseCase';

export class CreateTransferController {
  private readonly useCase: CreateTransferUseCase;

  constructor(useCase: CreateTransferUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      fromAccountId: req.body.fromAccountId,
      toAccountId: req.body.toAccountId,
      userId: userId,
      amount: req.body.amount,
      date: new Date(req.body.date),
    };

    const expense = await this.useCase.execute(dto);

    res.status(201).json(expense);
  }
}
