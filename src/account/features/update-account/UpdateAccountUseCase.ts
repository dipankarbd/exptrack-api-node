import { IUseCase } from '../../../shared/IUseCase';
import { AccountResponseDto, UpdateAccountRequestDto } from '../../shared/dto';

export interface IUpdateAccount {
  updateAccount(
    account: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto | null>;
}

type ResponseDto = AccountResponseDto | null;

export class UpdateAccountUseCase
  implements IUseCase<UpdateAccountRequestDto, ResponseDto>
{
  private readonly repository: IUpdateAccount;

  constructor(repository: IUpdateAccount) {
    this.repository = repository;
  }

  async execute(accountDto: UpdateAccountRequestDto): Promise<ResponseDto> {
    return await this.repository.updateAccount(accountDto);
  }
}
