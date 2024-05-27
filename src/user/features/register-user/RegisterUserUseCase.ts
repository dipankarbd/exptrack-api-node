import { IUseCase } from '../../../shared/IUseCase';
import { generatePassword } from '../../../utils';
import {
  RegisterUserRequestDto,
  CreateUserDto,
  UserResponseDto,
} from '../../shared/dto';

export interface ICreateUser {
  createUser(user: CreateUserDto): Promise<UserResponseDto>;
}

export class RegisterUserUseCase
  implements IUseCase<RegisterUserRequestDto, UserResponseDto>
{
  private readonly repository: ICreateUser;

  constructor(repository: ICreateUser) {
    this.repository = repository;
  }

  async execute(input: RegisterUserRequestDto): Promise<UserResponseDto> {
    const hashObj = generatePassword(input.password);

    const user = {
      role: input.role,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      salt: hashObj.salt,
      hash: hashObj.hash,
    };

    return await this.repository.createUser(user);
  }
}
