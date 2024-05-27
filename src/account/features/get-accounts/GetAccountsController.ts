import { Request, Response } from 'express';
import { GetAccountsUseCase } from './GetAccountsUseCase';

export class GetAccountsController {
  private readonly useCase: GetAccountsUseCase;

  constructor(useCase: GetAccountsUseCase) {
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
