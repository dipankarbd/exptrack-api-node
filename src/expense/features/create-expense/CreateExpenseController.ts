import { Request, Response } from 'express';
import { CreateExpenseUseCase } from './CreateExpenseUseCase';

export class CreateExpenseController {
  private readonly useCase: CreateExpenseUseCase;

  constructor(useCase: CreateExpenseUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      userId: userId,
      categoryId: req.body.categoryId,
      accountId: req.body.accountId,
      amount: req.body.amount,
      date: new Date(req.body.date),
    };

    const expense = await this.useCase.execute(dto);

    res.status(201).json(expense);
  }
}
