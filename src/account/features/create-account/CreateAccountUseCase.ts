import { IUseCase } from '../../../shared/IUseCase';
import { AccountResponseDto, CreateAccountRequestDto } from '../../shared/dto';

export interface ICreateAccount {
  createAccount(account: CreateAccountRequestDto): Promise<AccountResponseDto>;
}

export class CreateAccountUseCase
  implements IUseCase<CreateAccountRequestDto, AccountResponseDto>
{
  private readonly repository: ICreateAccount;

  constructor(repository: ICreateAccount) {
    this.repository = repository;
  }

  async execute(input: CreateAccountRequestDto): Promise<AccountResponseDto> {
    return await this.repository.createAccount(input);
  }
}
