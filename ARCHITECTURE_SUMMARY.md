# Clean Architecture Implementation Summary

## 🏛️ Clean Architecture Overview

이 프로젝트는 **Clean Architecture (Onion Architecture)** 를 Next.js 15.5.2에서 구현합니다.

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                 │
│    (App Router + React Components + Hooks)      │
│                     │                          │
│              ┌─────────────┐                    │
│              │ Application │                    │
│              │   Layer     │                    │
│              │ (Services)  │                    │
│              └─────────────┘                    │
│                     │                          │
│              ┌─────────────┐                    │
│              │   Domain    │                    │
│              │   Layer     │                    │
│              │(Entities +  │                    │
│              │Interfaces)  │                    │
│              └─────────────┘                    │
│                     ↑                          │
│              ┌─────────────┐                    │
│              │Infrastructure│                    │
│              │   Layer     │                    │
│              │(Repositories│                    │
│              │+ Actions)   │                    │
│              └─────────────┘                    │
└─────────────────────────────────────────────────┘
```

**의존성 방향**: Presentation → Application → Domain ← Infrastructure

## 📁 Directory Structure

```
src/features/authentication/
├── domain/                     # 🎯 Domain Layer (순수 비즈니스 로직)
│   ├── auth/
│   │   └── IAuthenticationRepository.ts
│   ├── user/
│   │   ├── User.ts            # Domain Entity
│   │   ├── UserFactory.ts     # Factory Pattern
│   │   ├── IUserRepository.ts # Repository Interface
│   │   └── index.ts
│   └── token/
│       ├── AccessToken.ts     # Value Object
│       ├── AccessTokenFactory.ts
│       ├── ITokenRepository.ts
│       └── index.ts
├── application/               # 🔧 Application Layer (서비스 조합)
│   ├── interfaces/
│   │   ├── IAuthenticationService.ts
│   │   └── IUserService.ts
│   └── services/
│       ├── AuthenticationService.ts
│       └── UserService.ts
├── infrastructure/           # 🛠️ Infrastructure Layer (외부 시스템)
│   ├── actions/             # Server Actions (Next.js 특화)
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── token.ts
│   │   └── user.ts
│   ├── di/                  # Dependency Injection
│   │   └── AuthenticationContainer.ts
│   └── repositories/        # Repository 구현체
│       ├── AuthenticationRepositoryImpl.ts
│       ├── TokenRepositoryImpl.ts
│       └── UserRepositoryImpl.ts
└── presentation/            # 🎨 Presentation Layer (UI)
    ├── components/
    ├── hooks/
    ├── pages/
    └── index.ts
```

## 🔄 Data Flow Examples

### 1. OAuth Authentication Flow

```typescript
// 1. Presentation Layer (App Router)
app/auth/success/page.tsx
  ↓ (uses DI Container)
AuthenticationContainer.getInstance()
  ↓ (calls)
AuthenticationService.processOAuthCallback()
  ↓ (uses)
TokenRepository.popTempAccessToken()
  ↓ (calls)
Server Actions (infrastructure/actions/token.ts)
```

### 2. User Data Retrieval

```typescript
// Service Layer
UserService.getUserProfile(token: string)
  ↓ (calls)
UserRepository.getUserByToken(token)
  ↓ (calls)  
Server Actions (infrastructure/actions/user.ts)
  ↓ (transforms via)
UserFactory.toDomain(apiData)
  ↓ (returns)
User Entity (domain/user/User.ts)
```

## 🏗️ Key Implementation Details

### Domain Layer (Pure Business Logic)

**Entities:**
```typescript
// domain/user/User.ts
export class User {
  constructor(
    public readonly id: UserId,
    public readonly name: string, 
    public readonly email: string
  ) {}
  
  get displayName(): string {
    return this.name || this.email.split('@')[0];
  }
  
  // Getter methods for controlled access
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
}
```

**Value Objects:**
```typescript
// domain/token/AccessToken.ts  
export class AccessToken {
  constructor(private readonly token: string) {}
  
  getValue(): string { return this.token; }
  getAuthHeader(): string { return `Bearer ${this.token}`; }
  isValid(): boolean { return this.token.length > 0; }
}
```

**Repository Interfaces:**
```typescript
// domain/user/IUserRepository.ts
export interface IUserRepository {
  getUserByToken(token: string): Promise<User | null>;
}
```

### Application Layer (Business Logic Orchestration)

```typescript
// application/services/AuthenticationService.ts
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private authRepository: IAuthenticationRepository,
    private tokenRepository: ITokenRepository
  ) {}

  async processOAuthCallback(): Promise<AuthResult> {
    const tempToken = await this.tokenRepository.popTempAccessToken();
    
    if (!tempToken?.isValid()) {
      return { success: false, data: null, error: 'Invalid token' };
    }
    
    return { success: true, data: tempToken };
  }
}
```

### Infrastructure Layer (External System Integration)

**Repository Implementation:**
```typescript
// infrastructure/repositories/UserRepositoryImpl.ts  
export class UserRepositoryImpl implements IUserRepository {
  async getUserByToken(token: string): Promise<User | null> {
    const user = await getUserByTokenAction(token); // Server Action 호출
    
    if (!user) return null;
    
    return UserFactory.toDomain(user); // Anti-corruption Layer
  }
}
```

**Server Actions (Next.js 특화 로직):**
```typescript
// infrastructure/actions/user.ts
'use server';

export const getUserByTokenAction = async (token: string) => {
  const userData = await apiJson<{id: string, name: string, email: string}>({
    baseUrl: process.env.BACKEND_USER_URL || 'http://localhost:3001',
    endpoint: '/user/me',
    method: 'GET', 
    token,
    autoRefreshOn401: true,
  });
  
  return userData;
};
```

### Presentation Layer (UI Components)

**App Router Integration:**
```typescript
// app/auth/success/page.tsx
'use client';

export default function AuthSuccessPage() {
  useEffect(() => {
    (async () => {
      try {
        const container = AuthenticationContainer.getInstance();
        const result = await container.authService.processOAuthCallback();
        
        if (result.success && result.data) {
          const path = `/debug?token=${encodeURIComponent(result.data.getValue())}`;
          router.replace(path as Route);
        }
      } catch (error) {
        // Error handling...
      }
    })();
  }, [router]);
}
```

## 🔧 Dependency Injection (DI Container)

```typescript
// infrastructure/di/AuthenticationContainer.ts
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
    this.authService = new AuthenticationService(authRepository, tokenRepository);
    this.userService = new UserService(userRepository);
  }

  public static getInstance(): AuthenticationContainer {
    if (!AuthenticationContainer.instance) {
      AuthenticationContainer.instance = new AuthenticationContainer();
    }
    return AuthenticationContainer.instance;
  }
}
```

## 🛡️ Anti-Corruption Layer Pattern

외부 API와 Domain 사이의 변환 계층:

```typescript
// infrastructure/repositories/UserRepositoryImpl.ts
export class UserRepositoryImpl implements IUserRepository {
  async getUserByToken(token: string): Promise<User | null> {
    const apiData = await getUserByTokenAction(token);
    
    if (!apiData) return null;
    
    // 🔑 Anti-corruption: API 응답 → Domain Entity 변환
    return UserFactory.toDomain({
      id: apiData.id,
      name: apiData.name, 
      email: apiData.email
    });
  }
}
```

## 🎯 Next.js Integration Strategies

### Server Actions for External Communication
- **목적**: `next/headers`, `cookies()` 등 Next.js 특화 기능을 Server Actions로 격리
- **패턴**: Repository 구현체에서 Server Actions 호출
- **장점**: Client Component에서도 안전하게 사용 가능

### Client/Server Component 분리
- **Server Components**: 초기 데이터 로딩 및 SEO
- **Client Components**: 상호작용 및 상태 관리
- **Hydration**: 서버/클라이언트 간 상태 동기화

### App Router Integration
- **라우팅**: `app/` 디렉토리에서 페이지별 진입점 제공
- **레이아웃**: 공통 UI 로직 분리
- **메타데이터**: SEO 최적화

## ✅ Architecture Benefits

### 🔒 **Separation of Concerns**
- Domain Layer: 순수 비즈니스 로직, 프레임워크 무관
- Application Layer: 비즈니스 로직 조합 및 흐름 제어
- Infrastructure Layer: 외부 시스템 통합 (API, Database, Next.js)
- Presentation Layer: UI 로직 및 사용자 상호작용

### 🧪 **Testability**  
- Domain Layer: 순수 함수로 단위 테스트 용이
- Application Layer: Mock Repository로 비즈니스 로직 테스트
- Infrastructure Layer: 통합 테스트로 외부 시스템 검증

### 🔄 **Maintainability**
- 의존성 방향 일관성으로 변경 영향 최소화
- Interface 기반 설계로 구현체 교체 용이
- DI Container로 의존성 관리 중앙화

### 🚀 **Scalability**
- 기능별 모듈화로 팀 단위 개발 가능
- Clean Architecture로 복잡도 증가에 대응
- Next.js 최적화 기능 활용으로 성능 확보

## 🎯 Current Implementation Status

✅ **완료된 구현:**
- Domain Layer: Entities, Value Objects, Repository Interfaces
- Application Layer: AuthenticationService, UserService  
- Infrastructure Layer: Repository 실현체, Server Actions, DI Container
- Presentation Layer: App Router 통합, Client Components
- Anti-corruption Layer: API 응답 → Domain Entity 변환
- TypeScript 오류 수정: 모든 catch 블록 타입 안전성 확보

🎯 **아키텍처 준수:**
- 의존성 방향 준수: Presentation → Application → Domain ← Infrastructure  
- 순수 Domain Layer: 외부 의존성 없는 비즈니스 로직
- Server Actions 격리: Next.js 특화 로직을 Infrastructure Layer로 분리
- Clean Component 호환: Repository가 Client Component에서 안전하게 작동