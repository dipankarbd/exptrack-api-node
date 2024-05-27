import { IUseCase } from '../../../shared/IUseCase';
import { CreateIncomeRequestDto, IncomeResponseDto } from '../../shared/dto';

export interface ICreateIncome {
  createIncome(Income: CreateIncomeRequestDto): Promise<IncomeResponseDto>;
}

export class CreateIncomeUseCase
  implements IUseCase<CreateIncomeRequestDto, IncomeResponseDto>
{
  private readonly repository: ICreateIncome;

  constructor(repository: ICreateIncome) {
    this.repository = repository;
  }

  async execute(input: CreateIncomeRequestDto): Promise<IncomeResponseDto> {
    return await this.repository.createIncome(input);
  }
}
