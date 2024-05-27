import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import postgres from 'postgres';
import 'express-async-errors';

import { RouterFactory, ConfigFactory } from './factory';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const pgClient = postgres(process.env.DATABASE_URL as string);

ConfigFactory.buildPassportConfigurator(pgClient)(passport);

const app: Express = express();

app.use(passport.initialize());
app.use(express.json());
app.use(
  '/api/accounts',
  passport.authenticate('jwt', { session: false }),
  RouterFactory.buildAccountRouter(pgClient),
);
app.use(
  '/api/expenses',
  passport.authenticate('jwt', { session: false }),
  RouterFactory.buildExpenseRouter(pgClient),
);
app.use(
  '/api/transfers',
  passport.authenticate('jwt', { session: false }),
  RouterFactory.buildTransferRouter(pgClient),
);
app.use(
  '/api/incomes',
  passport.authenticate('jwt', { session: false }),
  RouterFactory.buildIncomeRouter(pgClient),
);
app.use('/api/users', RouterFactory.buildUserRouter(pgClient));
app.use('/api/authenticate', RouterFactory.buildAuthRouter(pgClient));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
