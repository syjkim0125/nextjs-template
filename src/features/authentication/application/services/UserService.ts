import { IUserService } from '../interfaces/IUserService';

import { IUserRepository } from '../../domain/user/IUserRepository';
import { User } from '../../domain/user';

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

    async getUserProfile(token: string): Promise<User> {
        const result = await this.userRepository.getUserByToken(token);

        if (!result) {
            throw new Error('There is no user');
        }

        return result;
    }
}
