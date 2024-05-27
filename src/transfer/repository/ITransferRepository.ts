import { ICreateTransfer } from '../features/create-transfer/CreateTransferUseCase';
import { IDeleteTransfer } from '../features/delete-transfer/DeleteTransferUseCase';
import { IGetTransfers } from '../features/get-transfers/GetTransfersUseCase';

export interface ITransferRepository
  extends ICreateTransfer,
    IDeleteTransfer,
    IGetTransfers {}
