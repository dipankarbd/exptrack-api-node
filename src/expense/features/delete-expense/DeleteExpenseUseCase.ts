import { IUseCase } from '../../../shared/IUseCase';
import { DeleteExpenseRequestDto } from '../../shared/dto';

export interface IDeleteExpense {
  deleteExpense(dto: DeleteExpenseRequestDto): Promise<boolean>;
}

export class DeleteExpenseUseCase
  implements IUseCase<DeleteExpenseRequestDto, boolean>
{
  private readonly repository: IDeleteExpense;

  constructor(repository: IDeleteExpense) {
    this.repository = repository;
  }

  async execute(input: DeleteExpenseRequestDto): Promise<boolean> {
    return await this.repository.deleteExpense(input);
  }
}
