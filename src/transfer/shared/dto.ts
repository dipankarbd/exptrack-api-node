export type GetTransfersRequestDto = {
  userId: number;
};

export type CreateTransferRequestDto = {
  userId: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  date: Date;
};

export type DeleteTransferRequestDto = {
  transferId: number;
  userId: number;
};

export type TransferResponseDto = {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  date: Date;
};
