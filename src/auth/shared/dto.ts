import { RoleType } from '../../user/shared/dto';

export type UserDto = {
  id: number;
  role: RoleType;
  email: string;
  firstName: string;
  lastName: string;
  salt: string;
  hash: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  expires: string;
};
