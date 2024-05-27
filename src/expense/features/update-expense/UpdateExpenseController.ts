import { Request, Response } from 'express';
import { UpdateExpenseUseCase } from './UpdateExpenseUseCase';

export class UpdateExpenseController {
  private readonly useCase: UpdateExpenseUseCase;

  constructor(useCase: UpdateExpenseUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      id: parseInt(req.params.id),
      categoryId: req.body.categoryId,
      accountId: req.body.accountId,
      userId: userId,
      amount: req.body.amount,
      date: new Date(req.body.date),
    };

    const expense = await this.useCase.execute(dto);

    res.json(expense);
  }
}
