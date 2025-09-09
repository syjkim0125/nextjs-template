import { User } from './User';

export class UserFactory {
    static toDomain(apiData: {
        id: string;
        name: string;
        email: string;
    }): User {
        return new User(apiData.id, apiData.name, apiData.email);
    }
}
