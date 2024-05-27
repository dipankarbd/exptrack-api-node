export type ExpenseCategoryResponseDto = {
  id: number;
  name: string;
  parentId: number | null;
};

export type ExpenseResponseDto = {
  id: number;
  categoryId: number;
  categoryTitle: string;
  accountId: number;
  amount: number;
  date: Date;
};

export type CreateExpenseRequestDto = {
  userId: number;
  categoryId: number;
  accountId: number;
  amount: number;
  date: Date;
};

export type UpdateExpenseRequestDto = {
  id: number;
  userId: number;
  categoryId: number;
  accountId: number;
  amount: number;
  date: Date;
};

export type DeleteExpenseRequestDto = {
  userId: number;
  expenseId: number;
};

export type GetExpensesRequestDto = {
  userId: number;
};
