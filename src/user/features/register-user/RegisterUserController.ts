import { Request, Response } from 'express';
import { RegisterUserUseCase } from './RegisterUserUseCase';
import { RegisterUserRequestDto } from '../../shared/dto';

export class RegisterUserController {
  private readonly useCase: RegisterUserUseCase;

  constructor(useCase: RegisterUserUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: RegisterUserRequestDto = {
      role: 'Basic',
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };

    const resp = await this.useCase.execute(user);

    res.status(201).json(resp);
  }
}
