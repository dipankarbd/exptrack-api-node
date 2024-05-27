import { ICreateAccount } from '../features/create-account/CreateAccountUseCase';
import { IGetAccounts } from '../features/get-accounts/GetAccountsUseCase';
import { IUpdateAccount } from '../features/update-account/UpdateAccountUseCase';

export interface IAccountRepository
  extends IGetAccounts,
    ICreateAccount,
    IUpdateAccount {}
