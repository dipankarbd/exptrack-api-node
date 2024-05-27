export type IncomeSourceType = 'Salary' | 'Interest' | 'Profit' | 'Other';

export type GetIncomesRequestDto = {
  userId: number;
};

export type CreateIncomeRequestDto = {
  accountId: number;
  userId: number;
  amount: number;
  date: Date;
  source: IncomeSourceType;
};

export type DeleteIncomeRequestDto = {
  incomeId: number;
  userId: number;
};

export type IncomeResponseDto = {
  id: number;
  accountId: number;
  amount: number;
  date: Date;
  source: IncomeSourceType;
};
