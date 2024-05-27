import { Router } from 'express';

import {
  createAccountRouter,
  GetAccountsUseCase,
  CreateAccountUseCase,
  UpdateAccountUseCase,
  GetAccountsController,
  CreateAccountController,
  UpdateAccountController,
  PgAccountRepository,
} from './account';
import {
  CreateExpenseController,
  CreateExpenseUseCase,
  DeleteExpenseController,
  DeleteExpenseUseCase,
  GetCategoriesController,
  GetCategoriesUseCase,
  GetExpensesController,
  GetExpensesUseCase,
  UpdateExpenseUseCase,
  UpdateExpenseController,
  createExpenseRouter,
  PgExpenseRepository,
} from './expense';

import {
  CreateTransferController,
  CreateTransferUseCase,
  DeleteTransferController,
  DeleteTransferUseCase,
  GetTransfersController,
  GetTransfersUseCase,
  PgTransferRepository,
  createTransferRouter,
} from './transfer';
import {
  CreateIncomeController,
  CreateIncomeUseCase,
  DeleteIncomeController,
  DeleteIncomeUseCase,
  GetIncomesController,
  GetIncomesUseCase,
  PgIncomeRepository,
  createIncomeRouter,
} from './income';
import {
  PgUserRepository,
  RegisterUserController,
  RegisterUserUseCase,
  UpdatePasswordController,
  UpdatePasswordUseCase,
  createUserRouter,
} from './user';

import { LoginUseCase } from './auth/features/login/LoginUseCase';
import {
  LoginController,
  PgAuthRepository,
  createAuthRouter,
  createConfigurePassport,
} from './auth';
import postgres from 'postgres';

export class RouterFactory {
  public static buildAccountRouter = (pgClient: postgres.Sql): Router => {
    const repo = new PgAccountRepository(pgClient);

    const getAccountUseCase = new GetAccountsUseCase(repo);
    const createAccountUseCase = new CreateAccountUseCase(repo);
    const updateAccountUseCase = new UpdateAccountUseCase(repo);

    const getAccountsController = new GetAccountsController(getAccountUseCase);
    const createAccountController = new CreateAccountController(
      createAccountUseCase,
    );
    const updateAccountController = new UpdateAccountController(
      updateAccountUseCase,
    );

    const accountRouter = createAccountRouter(
      getAccountsController,
      createAccountController,
      updateAccountController,
    );

    return accountRouter;
  };

  public static buildExpenseRouter = (pgClient: postgres.Sql): Router => {
    const repo = new PgExpenseRepository(pgClient);

    const getCategoriesUseCase = new GetCategoriesUseCase(repo);
    const createExpenseUseCase = new CreateExpenseUseCase(repo);
    const getExpensesUseCase = new GetExpensesUseCase(repo);
    const deleteExpenseUseCase = new DeleteExpenseUseCase(repo);
    const updateExpenseUseCase = new UpdateExpenseUseCase(repo);

    const getCategoriesController = new GetCategoriesController(
      getCategoriesUseCase,
    );
    const createExpenseController = new CreateExpenseController(
      createExpenseUseCase,
    );
    const getExpensesController = new GetExpensesController(getExpensesUseCase);
    const deleteExpenseController = new DeleteExpenseController(
      deleteExpenseUseCase,
    );
    const updateExpenseController = new UpdateExpenseController(
      updateExpenseUseCase,
    );

    const expenseRouter = createExpenseRouter(
      getCategoriesController,
      createExpenseController,
      getExpensesController,
      deleteExpenseController,
      updateExpenseController,
    );

    return expenseRouter;
  };

  public static buildTransferRouter = (pgClient: postgres.Sql): Router => {
    const repo = new PgTransferRepository(pgClient);

    const getTransfersUseCase = new GetTransfersUseCase(repo);
    const createTransferUseCase = new CreateTransferUseCase(repo);
    const deleteTransferUseCase = new DeleteTransferUseCase(repo);

    const getTransfersController = new GetTransfersController(
      getTransfersUseCase,
    );
    const createTransferController = new CreateTransferController(
      createTransferUseCase,
    );
    const deleteTransferController = new DeleteTransferController(
      deleteTransferUseCase,
    );

    const expenseRouter = createTransferRouter(
      getTransfersController,
      createTransferController,
      deleteTransferController,
    );

    return expenseRouter;
  };

  public static buildIncomeRouter = (pgClient: postgres.Sql): Router => {
    const repo = new PgIncomeRepository(pgClient);

    const getIncomesUseCase = new GetIncomesUseCase(repo);
    const createIncomeUseCase = new CreateIncomeUseCase(repo);
    const deleteIncomeUseCase = new DeleteIncomeUseCase(repo);

    const getIncomesController = new GetIncomesController(getIncomesUseCase);
    const createIncomeController = new CreateIncomeController(
      createIncomeUseCase,
    );
    const deleteIncomeController = new DeleteIncomeController(
      deleteIncomeUseCase,
    );

    const expenseRouter = createIncomeRouter(
      getIncomesController,
      createIncomeController,
      deleteIncomeController,
    );

    return expenseRouter;
  };

  public static buildUserRouter = (pgClient: postgres.Sql): Router => {
    const repo = new PgUserRepository(pgClient);

    const registerUserUseCase = new RegisterUserUseCase(repo);
    const updatePasswordUseCase = new UpdatePasswordUseCase(repo);

    const registerUserController = new RegisterUserController(
      registerUserUseCase,
    );
    const updatePasswordController = new UpdatePasswordController(
      updatePasswordUseCase,
    );

    const userRouter = createUserRouter(
      registerUserController,
      updatePasswordController,
    );

    return userRouter;
  };

  public static buildAuthRouter = (pgClient: postgres.Sql): Router => {
    const repo = new PgAuthRepository(pgClient);

    const loginUseCase = new LoginUseCase(repo);
    const loginController = new LoginController(loginUseCase);

    const userRouter = createAuthRouter(loginController);

    return userRouter;
  };
}

export class ConfigFactory {
  public static buildPassportConfigurator = (pgClient: postgres.Sql) => {
    const repo = new PgAuthRepository(pgClient);
    return createConfigurePassport(repo);
  };
}
