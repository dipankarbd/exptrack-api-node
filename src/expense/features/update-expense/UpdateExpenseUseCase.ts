import { IUseCase } from '../../../shared/IUseCase';
import { ExpenseResponseDto, UpdateExpenseRequestDto } from '../../shared/dto';

export interface IUpdateExpense {
  updateExpense(
    expense: UpdateExpenseRequestDto,
  ): Promise<ExpenseResponseDto | null>;
}

export class UpdateExpenseUseCase
  implements IUseCase<UpdateExpenseRequestDto, ExpenseResponseDto | null>
{
  private readonly repository: IUpdateExpense;

  constructor(repository: IUpdateExpense) {
    this.repository = repository;
  }

  async execute(
    input: UpdateExpenseRequestDto,
  ): Promise<ExpenseResponseDto | null> {
    return await this.repository.updateExpense(input);
  }
}
