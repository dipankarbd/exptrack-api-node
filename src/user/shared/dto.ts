export type RoleType = 'Admin' | 'Basic';

export type RegisterUserRequestDto = {
  role: RoleType;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type CreateUserDto = {
  role: RoleType;
  email: string;
  firstName: string;
  lastName: string;
  salt: string;
  hash: string;
};

export type UpdatePasswordRequestDto = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export type UpdatePasswordDto = {
  id: number;
  salt: string;
  hash: string;
};

export type UserResponseDto = {
  id: number;
  role: RoleType;
  email: string;
  firstName: string;
  lastName: string;
};

export type UserDto = {
  id: number;
  role: RoleType;
  email: string;
  firstName: string;
  lastName: string;
  salt: string;
  hash: string;
};
