import { IUseCase } from '../../../shared/IUseCase';
import { DeleteIncomeRequestDto } from '../../shared/dto';

export interface IDeleteIncome {
  deleteIncome(dto: DeleteIncomeRequestDto): Promise<boolean>;
}

export class DeleteIncomeUseCase
  implements IUseCase<DeleteIncomeRequestDto, boolean>
{
  private readonly repository: IDeleteIncome;

  constructor(repository: IDeleteIncome) {
    this.repository = repository;
  }

  async execute(input: DeleteIncomeRequestDto): Promise<boolean> {
    return await this.repository.deleteIncome(input);
  }
}
