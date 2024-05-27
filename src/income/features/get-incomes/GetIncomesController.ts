import { Request, Response } from 'express';
import { GetIncomesUseCase } from './GetIncomesUseCase';

export class GetIncomesController {
  private readonly useCase: GetIncomesUseCase;

  constructor(useCase: GetIncomesUseCase) {
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
