import { IUseCase } from '../../../shared/IUseCase';
import { generatePassword, varifyPassword } from '../../../utils';
import {
  UpdatePasswordRequestDto,
  UserDto,
  UpdatePasswordDto,
} from '../../shared/dto';

export interface IGetUser {
  getUser(userId: number): Promise<UserDto | undefined>;
}

export interface IUpdateUserPassword {
  updatePassword(user: UpdatePasswordDto): Promise<boolean>;
}

type IRepository = IGetUser & IUpdateUserPassword;

export class UpdatePasswordUseCase
  implements IUseCase<UpdatePasswordRequestDto, boolean>
{
  private readonly repository: IRepository;

  constructor(repository: IRepository) {
    this.repository = repository;
  }

  async execute(input: UpdatePasswordRequestDto): Promise<boolean> {
    const user = await this.repository.getUser(input.id);

    if (user) {
      const valid = varifyPassword(input.oldPassword, user.hash, user.salt);
      if (valid) {
        const hashObj = generatePassword(input.newPassword);

        const updatedObj = {
          id: input.id,
          salt: hashObj.salt,
          hash: hashObj.hash,
        };

        return await this.repository.updatePassword(updatedObj);
      }
    }

    return false;
  }
}
