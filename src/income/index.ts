import express, { Router } from 'express';
import { GetIncomesController } from './features/get-incomes/GetIncomesController';
import { CreateIncomeController } from './features/create-income/CreateIncomeController';
import { DeleteIncomeController } from './features/delete-income/DeleteIncomeController';

export const createIncomeRouter = (
  getIncomesController: GetIncomesController,
  createIncomeController: CreateIncomeController,
  deleteIncomeController: DeleteIncomeController,
): Router => {
  const router = express.Router();

  router.get('/', (req, res) => getIncomesController.handle(req, res));
  router.post('/', (req, res) => createIncomeController.handle(req, res));
  router.delete('/:id', (req, res) => deleteIncomeController.handle(req, res));

  return router;
};

export * from './features/get-incomes/GetIncomesUseCase';
export * from './features/create-income/CreateIncomeUseCase';
export * from './features/delete-income/DeleteIncomeUseCase';
export * from './features/get-incomes/GetIncomesController';
export * from './features/create-income/CreateIncomeController';
export * from './features/delete-income/DeleteIncomeController';
export * from './repository/PgIncomeRepository';
