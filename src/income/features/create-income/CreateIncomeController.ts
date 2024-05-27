import { Request, Response } from 'express';
import { CreateIncomeUseCase } from './CreateIncomeUseCase';

export class CreateIncomeController {
  private readonly useCase: CreateIncomeUseCase;

  constructor(useCase: CreateIncomeUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      accountId: req.body.accountId,
      userId: userId,
      amount: req.body.amount,
      date: new Date(req.body.date),
      source: req.body.source,
    };

    const expense = await this.useCase.execute(dto);

    res.status(201).json(expense);
  }
}
