export type AccountType = 'Bank' | 'Cash' | 'CreditCard';
export type AccountState = 'Active' | 'Inactive' | 'Closed';

export type GetAccountsRequestDto = {
  userId: number;
};

export type CreateAccountRequestDto = {
  userId: number;
  name: string;
  accountType: AccountType;
  initialAmount: number;
};

export type UpdateAccountRequestDto = {
  id: number;
  userId: number;
  name: string;
  accountType: AccountType;
  accountState: AccountState;
  initialAmount: number;
};

export type AccountResponseDto = {
  id: number;
  name: string;
  accountType: AccountType;
  accountState: AccountState;
  initialAmount: number;
  currentBalance: number;
};
