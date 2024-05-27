import { Request, Response } from 'express';
import { DeleteIncomeUseCase } from './DeleteIncomeUseCase';

export class DeleteIncomeController {
  private readonly useCase: DeleteIncomeUseCase;

  constructor(useCase: DeleteIncomeUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      incomeId: parseInt(req.params.id),
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
