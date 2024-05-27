import { IUseCase } from '../../../shared/IUseCase';
import { ExpenseResponseDto, GetExpensesRequestDto } from '../../shared/dto';

export interface IGetExpenses {
  getExpenses(userId: number): Promise<ExpenseResponseDto[]>;
}

export class GetExpensesUseCase
  implements IUseCase<GetExpensesRequestDto, ExpenseResponseDto[]>
{
  private readonly repository: IGetExpenses;

  constructor(repository: IGetExpenses) {
    this.repository = repository;
  }

  public async execute({
    userId,
  }: GetExpensesRequestDto): Promise<ExpenseResponseDto[]> {
    return await this.repository.getExpenses(userId);
  }
}
