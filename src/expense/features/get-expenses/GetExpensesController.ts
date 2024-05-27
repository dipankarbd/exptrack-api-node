import { Request, Response } from 'express';
import { GetExpensesUseCase } from './GetExpensesUseCase';

export class GetExpensesController {
  private readonly useCase: GetExpensesUseCase;

  constructor(useCase: GetExpensesUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const result = await this.useCase.execute({
      userId,
    });

    res.json(result);
  }
}
