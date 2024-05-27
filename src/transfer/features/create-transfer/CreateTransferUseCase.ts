import { IUseCase } from '../../../shared/IUseCase';
import {
  CreateTransferRequestDto,
  TransferResponseDto,
} from '../../shared/dto';

export interface ICreateTransfer {
  createTransfer(
    transfer: CreateTransferRequestDto,
  ): Promise<TransferResponseDto>;
}

export class CreateTransferUseCase
  implements IUseCase<CreateTransferRequestDto, TransferResponseDto>
{
  private readonly repository: ICreateTransfer;

  constructor(repository: ICreateTransfer) {
    this.repository = repository;
  }

  async execute(input: CreateTransferRequestDto): Promise<TransferResponseDto> {
    return await this.repository.createTransfer(input);
  }
}
