import { Request, Response } from 'express';
import { DeleteExpenseUseCase } from './DeleteExpenseUseCase';

export class DeleteExpenseController {
  private readonly useCase: DeleteExpenseUseCase;

  constructor(useCase: DeleteExpenseUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      expenseId: parseInt(req.params.id),
      userId: userId,
    };

    const success = await this.useCase.execute(dto);
    if (success === false) {
      res.sendStatus(404);
    } else {
      res.json(success);
    }
  }
}
