import { Request, Response } from 'express';
import { UpdateAccountUseCase } from './UpdateAccountUseCase';

export class UpdateAccountController {
  private readonly useCase: UpdateAccountUseCase;

  constructor(useCase: UpdateAccountUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const id = parseInt(req.params.id);

    const updateAccountDto = {
      userId: userId,
      id: id,
      name: req.body.name,
      accountType: req.body.accountType,
      accountState: req.body.accountState,
      initialAmount: req.body.initialAmount,
    };

    const account = await this.useCase.execute(updateAccountDto);

    if (account === null) {
      res.sendStatus(404);
    } else {
      res.json(account);
    }
  }
}
