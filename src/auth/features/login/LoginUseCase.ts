import { IUseCase } from '../../../shared/IUseCase';
import { generateToken, varifyPassword } from '../../../utils';
import { LoginRequestDto, LoginResponseDto, UserDto } from '../../shared/dto';

export interface IGetUserByEmail {
  getUserByEmail(email: string): Promise<UserDto | undefined>;
}

export class LoginUseCase
  implements IUseCase<LoginRequestDto, LoginResponseDto | undefined>
{
  private readonly repository: IGetUserByEmail;

  constructor(repository: IGetUserByEmail) {
    this.repository = repository;
  }

  async execute(input: LoginRequestDto): Promise<LoginResponseDto | undefined> {
    const user = await this.repository.getUserByEmail(input.email);

    if (user) {
      const valid = varifyPassword(input.password, user.hash, user.salt);
      if (valid) {
        const token = generateToken(user.id);
        return token;
      }
    }

    return undefined;
  }
}
