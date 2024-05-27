import { IGetUser } from '../../user';
import { IGetUserByEmail } from '../features/login/LoginUseCase';

export interface IAuthRepository extends IGetUserByEmail, IGetUser {}
