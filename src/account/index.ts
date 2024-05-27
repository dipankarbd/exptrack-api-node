import express, { Router } from 'express';
import { GetAccountsController } from './features/get-accounts/GetAccountsController';
import { CreateAccountController } from './features/create-account/CreateAccountController';
import { UpdateAccountController } from './features/update-account/UpdateAccountController';

export const createAccountRouter = (
  getAccountsController: GetAccountsController,
  createAccountController: CreateAccountController,
  updateAccountController: UpdateAccountController,
): Router => {
  const router = express.Router();

  router.get('/', (req, res) => getAccountsController.handle(req, res));
  router.post('/', (req, res) => createAccountController.handle(req, res));
  router.put('/:id', (req, res) => updateAccountController.handle(req, res));

  return router;
};

export * from './features/get-accounts/GetAccountsUseCase';
export * from './features/create-account/CreateAccountUseCase';
export * from './features/update-account/UpdateAccountUseCase';
export * from './features/create-account/CreateAccountController';
export * from './features/get-accounts/GetAccountsController';
export * from './features/update-account/UpdateAccountController';
export * from './repository/PgAccountRepository';
