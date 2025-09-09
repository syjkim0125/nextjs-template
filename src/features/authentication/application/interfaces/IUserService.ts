import { User } from '../../domain/user';

export interface IUserService {
    getUserProfile(tempAccessToken: string): Promise<User>;
}
