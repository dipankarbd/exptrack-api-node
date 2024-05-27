import { Request, Response } from 'express';
import { UpdatePasswordUseCase } from './UpdatePasswordUseCase';

export class UpdatePasswordController {
  private readonly useCase: UpdatePasswordUseCase;

  constructor(useCase: UpdatePasswordUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const obj = {
      id: userId,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    };

    const resp = await this.useCase.execute(obj);

    res.json(resp);
  }
}
