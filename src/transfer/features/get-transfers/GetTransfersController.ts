import { Request, Response } from 'express';
import { GetTransfersUseCase } from './GetTransfersUseCase';

export class GetTransfersController {
  private readonly useCase: GetTransfersUseCase;

  constructor(useCase: GetTransfersUseCase) {
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
