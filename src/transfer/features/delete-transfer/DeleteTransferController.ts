import { Request, Response } from 'express';
import { DeleteTransferUseCase } from './DeleteTransferUseCase';

export class DeleteTransferController {
  private readonly useCase: DeleteTransferUseCase;

  constructor(useCase: DeleteTransferUseCase) {
    this.useCase = useCase;
  }

  public async handle(req: Request, res: Response): Promise<void> {
    const user: any = req.user;
    const userId = user.id;

    const dto = {
      transferId: parseInt(req.params.id),
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
