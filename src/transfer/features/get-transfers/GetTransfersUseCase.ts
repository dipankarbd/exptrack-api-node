import { IUseCase } from '../../../shared/IUseCase';
import { GetTransfersRequestDto, TransferResponseDto } from '../../shared/dto';

export interface IGetTransfers {
  getTransfers(userId: number): Promise<TransferResponseDto[]>;
}

export class GetTransfersUseCase
  implements IUseCase<GetTransfersRequestDto, TransferResponseDto[]>
{
  private readonly repository: IGetTransfers;

  constructor(repository: IGetTransfers) {
    this.repository = repository;
  }

  public async execute({
    userId,
  }: GetTransfersRequestDto): Promise<TransferResponseDto[]> {
    return await this.repository.getTransfers(userId);
  }
}
