import { IUseCase } from '../../../shared/IUseCase';
import { ExpenseCategoryResponseDto } from '../../shared/dto';

export interface IGetExpenseCategories {
  getCategories(): Promise<ExpenseCategoryResponseDto[]>;
}

export class GetCategoriesUseCase
  implements IUseCase<void, ExpenseCategoryResponseDto[]>
{
  private readonly repository: IGetExpenseCategories;

  constructor(repository: IGetExpenseCategories) {
    this.repository = repository;
  }

  public async execute(): Promise<ExpenseCategoryResponseDto[]> {
    const categories = await this.repository.getCategories();
    return categories;
  }
}
