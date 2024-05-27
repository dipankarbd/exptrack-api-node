import { IUseCase } from '../../../shared/IUseCase';
import { DeleteTransferRequestDto } from '../../shared/dto';

export interface IDeleteTransfer {
  deleteTransfer(dto: DeleteTransferRequestDto): Promise<boolean>;
}

export class DeleteTransferUseCase
  implements IUseCase<DeleteTransferRequestDto, boolean>
{
  private readonly repository: IDeleteTransfer;

  constructor(repository: IDeleteTransfer) {
    this.repository = repository;
  }

  async execute(input: DeleteTransferRequestDto): Promise<boolean> {
    return await this.repository.deleteTransfer(input);
  }
}
