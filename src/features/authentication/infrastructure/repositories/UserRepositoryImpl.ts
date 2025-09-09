import { User, UserFactory } from '../../domain/user';
import { IUserRepository } from '../../domain/user/IUserRepository';
import { getUserByTokenAction } from '../actions/user';

export class UserRepositoryImpl implements IUserRepository {
    async getUserByToken(token: string): Promise<User | null> {
        const user = await getUserByTokenAction(token);

        if (!user) return null;

        return UserFactory.toDomain(user);
    }
}
