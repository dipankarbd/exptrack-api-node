import { Request, Response } from 'express';
import { CreateAccountUseCase } from './CreateAccountUseCase';

export class CreateAccountController {
  private readonly useCase: CreateAccountUseCase;

  constructor(useCase: CreateAccountUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const createAccountDto = {
      userId: userId,
      name: req.body.name,
      accountType: req.body.accountType,
      initialAmount: req.body.initialAmount,
    };

    const account = await this.useCase.execute(createAccountDto);

    res.status(201).json(account);
  }
}
