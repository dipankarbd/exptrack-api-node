import { ICreateExpense } from '../features/create-expense/CreateExpenseUseCase';
import { IDeleteExpense } from '../features/delete-expense/DeleteExpenseUseCase';
import { IGetExpenseCategories } from '../features/get-categories/GetCategoriesUseCase';
import { IGetExpenses } from '../features/get-expenses/GetExpensesUseCase';
import { IUpdateExpense } from '../features/update-expense/UpdateExpenseUseCase';

export interface IExpenseRepository
  extends IGetExpenseCategories,
    ICreateExpense,
    IGetExpenses,
    IDeleteExpense,
    IUpdateExpense {}
