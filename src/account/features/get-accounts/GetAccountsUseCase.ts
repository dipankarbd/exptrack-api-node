import { IUseCase } from '../../../shared/IUseCase';
import { GetAccountsRequestDto, AccountResponseDto } from '../../shared/dto';

export interface IGetAccounts {
  getAccounts(userId: number): Promise<AccountResponseDto[]>;
}

export class GetAccountsUseCase
  implements IUseCase<GetAccountsRequestDto, AccountResponseDto[]>
{
  private readonly repository: IGetAccounts;

  constructor(repository: IGetAccounts) {
    this.repository = repository;
  }

  public async execute({
    userId,
  }: GetAccountsRequestDto): Promise<AccountResponseDto[]> {
    return await this.repository.getAccounts(userId);
  }
}
