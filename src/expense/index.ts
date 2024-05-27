import express, { Router } from 'express';
import { GetCategoriesController } from './features/get-categories/GetCategoriesController';
import { CreateExpenseController } from './features/create-expense/CreateExpenseController';
import { GetExpensesController } from './features/get-expenses/GetExpensesController';
import { DeleteExpenseController } from './features/delete-expense/DeleteExpenseController';
import { UpdateExpenseController } from './features/update-expense/UpdateExpenseController';

export const createExpenseRouter = (
  getCategoriesController: GetCategoriesController,
  createExpenseController: CreateExpenseController,
  getExpensesController: GetExpensesController,
  deleteExpenseController: DeleteExpenseController,
  updateExpenseController: UpdateExpenseController,
): Router => {
  const router = express.Router();

  router.get('/categories', (req, res) =>
    getCategoriesController.handle(req, res),
  );

  router.get('/', (req, res) => getExpensesController.handle(req, res));
  router.post('/', (req, res) => createExpenseController.handle(req, res));
  router.delete('/:id', (req, res) => deleteExpenseController.handle(req, res));
  router.put('/:id', (req, res) => updateExpenseController.handle(req, res));

  return router;
};

export * from './features/get-categories/GetCategoriesController';
export * from './features/get-categories/GetCategoriesUseCase';
export * from './features/create-expense/CreateExpenseController';
export * from './features/create-expense/CreateExpenseUseCase';
export * from './features/get-expenses/GetExpensesController';
export * from './features/get-expenses/GetExpensesUseCase';
export * from './features/delete-expense/DeleteExpenseUseCase';
export * from './features/delete-expense/DeleteExpenseController';
export * from './features/update-expense/UpdateExpenseUseCase';
export * from './features/update-expense/UpdateExpenseController';
export * from './repository/PgExpenseRepository';
