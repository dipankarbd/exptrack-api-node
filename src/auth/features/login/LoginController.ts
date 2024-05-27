import { Request, Response } from 'express';
import { LoginUseCase } from './LoginUseCase';

export class LoginController {
  private readonly useCase: LoginUseCase;

  constructor(useCase: LoginUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const payload = {
      email: req.body.email,
      password: req.body.password,
    };

    const resp = await this.useCase.execute(payload);

    if (resp) {
      res.json(resp);
    } else {
      res.status(401).json({ error: 'Wrong username or password' });
    }
  }
}
