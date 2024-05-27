import { ICreateUser } from '../features/register-user/RegisterUserUseCase';
import {
  IGetUser,
  IUpdateUserPassword,
} from '../features/update-password/UpdatePasswordUseCase';

export interface IUserRepository
  extends ICreateUser,
    IGetUser,
    IUpdateUserPassword {}
