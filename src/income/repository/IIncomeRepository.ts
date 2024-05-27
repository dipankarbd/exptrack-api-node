import { ICreateIncome } from '../features/create-income/CreateIncomeUseCase';
import { IDeleteIncome } from '../features/delete-income/DeleteIncomeUseCase';
import { IGetIncomes } from '../features/get-incomes/GetIncomesUseCase';

export interface IIncomeRepository
  extends ICreateIncome,
    IDeleteIncome,
    IGetIncomes {}
