import express, { Router } from 'express';
import { LoginController } from './features/login/LoginController';
import { configurePassport } from './config/passport';
import { IGetUser } from '../user';

export const createAuthRouter = (loginController: LoginController): Router => {
  const router = express.Router();

  router.post('/', (req, res) => loginController.handle(req, res));

  return router;
};

export const createConfigurePassport = (repository: IGetUser) => {
  return configurePassport(repository);
};

export * from './features/login/LoginController';
export * from './features/login/LoginUseCase';
export * from './repository/PgAuthRepository';
