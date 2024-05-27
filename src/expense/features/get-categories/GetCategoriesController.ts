import { Request, Response } from 'express';
import { GetCategoriesUseCase } from './GetCategoriesUseCase';

export class GetCategoriesController {
  private readonly useCase: GetCategoriesUseCase;

  constructor(useCase: GetCategoriesUseCase) {
    this.useCase = useCase;
  }

  public async handle(_req: Request, res: Response): Promise<void> {
    const result = await this.useCase.execute();
    res.json(result);
  }
}
