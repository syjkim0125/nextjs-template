import { User } from './User';

export interface IUserRepository {
    getUserByToken(token: string): Promise<User | null>;
}
