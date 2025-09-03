// User Factory - Handles User entity creation from backend API response
// Separates data transformation logic from domain entity

import { User } from './User';

export class UserFactory {
    // Create User from backend API response (GetUserResponseDto)
    static toDomain(apiData: {
        id: string;
        name: string;
        email: string;
    }): User {
        return new User(apiData.id, apiData.name, apiData.email);
    }
}
