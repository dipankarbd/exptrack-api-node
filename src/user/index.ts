import express, { Router } from 'express';

import { UpdatePasswordController } from './features/update-password/UpdatePasswordController';
import { RegisterUserController } from './features/register-user/RegisterUserController';
import passport from 'passport';

export const createUserRouter = (
  registerUserController: RegisterUserController,
  updatePasswordController: UpdatePasswordController,
): Router => {
  const router = express.Router();

  router.post('/register', (req, res) =>
    registerUserController.handle(req, res),
  );
  router.put(
    '/update-password',
    passport.authenticate('jwt', { session: false }),
    (req, res) => updatePasswordController.handle(req, res),
  );

  return router;
};

export * from './features/update-password/UpdatePasswordController';
export * from './features/register-user/RegisterUserController';
export * from './features/update-password/UpdatePasswordUseCase';
export * from './features/register-user/RegisterUserUseCase';
export * from './repository/PgUserRepository';
