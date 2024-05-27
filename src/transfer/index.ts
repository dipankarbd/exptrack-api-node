import express, { Router } from 'express';
import { GetTransfersController } from './features/get-transfers/GetTransfersController';
import { CreateTransferController } from './features/create-transfer/CreateTransferController';
import { DeleteTransferController } from './features/delete-transfer/DeleteTransferController';

export const createTransferRouter = (
  getTransfersController: GetTransfersController,
  createTransferController: CreateTransferController,
  deleteTransferController: DeleteTransferController,
): Router => {
  const router = express.Router();

  router.get('/', (req, res) => getTransfersController.handle(req, res));
  router.post('/', (req, res) => createTransferController.handle(req, res));
  router.delete('/:id', (req, res) =>
    deleteTransferController.handle(req, res),
  );

  return router;
};

export * from './features/get-transfers/GetTransfersUseCase';
export * from './features/create-transfer/CreateTransferUseCase';
export * from './features/delete-transfer/DeleteTransferUseCase';
export * from './features/get-transfers/GetTransfersController';
export * from './features/create-transfer/CreateTransferController';
export * from './features/delete-transfer/DeleteTransferController';
export * from './repository/PgTransferRepository';
