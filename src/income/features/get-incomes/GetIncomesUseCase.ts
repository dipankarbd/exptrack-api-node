import { IUseCase } from '../../../shared/IUseCase';
import { GetIncomesRequestDto, IncomeResponseDto } from '../../shared/dto';

export interface IGetIncomes {
  getIncomes(userId: number): Promise<IncomeResponseDto[]>;
}

export class GetIncomesUseCase
  implements IUseCase<GetIncomesRequestDto, IncomeResponseDto[]>
{
  private readonly repository: IGetIncomes;

  constructor(repository: IGetIncomes) {
    this.repository = repository;
  }

  public async execute({
    userId,
  }: GetIncomesRequestDto): Promise<IncomeResponseDto[]> {
    return await this.repository.getIncomes(userId);
  }
}
