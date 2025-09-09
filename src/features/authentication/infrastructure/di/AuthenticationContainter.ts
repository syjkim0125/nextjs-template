import { AuthenticationService } from '../../application/services/AuthenticationService';
import { UserService } from '../../application/services/UserService';
import { AuthenticationRepositoryImpl } from '../repositories/AuthenticationRepositoryImpl';
import { UserRepositoryImpl } from '../repositories/UserRepositoryImpl';
import { TokenRepositoryImpl } from '../repositories/TokenRepositoryImpl';

export class AuthenticationContainer {
    private static instance: AuthenticationContainer;

    public readonly authService: AuthenticationService;
    public readonly userService: UserService;

    private constructor() {
        // Repository 구현체 생성
        const authRepository = new AuthenticationRepositoryImpl();
        const userRepository = new UserRepositoryImpl();
        const tokenRepository = new TokenRepositoryImpl();

        // Service 생성 및 의존성 주입
        this.authService = new AuthenticationService(
            authRepository,
            tokenRepository
        );

        this.userService = new UserService(userRepository);
    }

    public static getInstance(): AuthenticationContainer {
        if (!AuthenticationContainer.instance) {
            AuthenticationContainer.instance = new AuthenticationContainer();
        }
        return AuthenticationContainer.instance;
    }
}

export const authContainer = AuthenticationContainer.getInstance();
