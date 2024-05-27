import { IUseCase } from '../../../shared/IUseCase';
import { CreateExpenseRequestDto, ExpenseResponseDto } from '../../shared/dto';

export interface ICreateExpense {
  createExpense(expense: CreateExpenseRequestDto): Promise<ExpenseResponseDto>;
}

export class CreateExpenseUseCase
  implements IUseCase<CreateExpenseRequestDto, ExpenseResponseDto>
{
  private readonly repository: ICreateExpense;

  constructor(repository: ICreateExpense) {
    this.repository = repository;
  }

  async execute(input: CreateExpenseRequestDto): Promise<ExpenseResponseDto> {
    return await this.repository.createExpense(input);
  }
}
