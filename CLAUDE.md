# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Function & Method Guidelines**:

-   Methods under 20 lines preferred
-   Parameters limited to 3, use objects for more
-   Pure functions preferred, minimize side effects
-   Guard clauses for early returns and validation
-   Meaningful names that express intent

**Functional Programming Style**:

-   Prefer functional programming patterns over imperative when applicable
-   Use `map()`, `filter()`, `reduce()`, `find()` instead of traditional loops
-   Immutable data structures and operations (avoid mutating arrays/objects)
-   Function composition for complex data transformations
-   Declarative code style that expresses "what" rather than "how"
-   Higher-order functions for reusable logic patterns
-   Avoid nested conditionals, prefer early returns and functional chains

**Code Readability & Expressiveness**:

-   Self-documenting code that reduces need for comments
-   Descriptive variable names that explain business context
-   Extract complex conditions into well-named boolean variables
-   Use method chaining for readable data transformations
-   Prefer explicit over implicit, clarity over cleverness
-   Break complex expressions into intermediate variables with meaningful names
-   Use TypeScript's optional chaining (`?.`) and nullish coalescing (`??`) for cleaner null handling

## Development Rules

### Code Change Policy

-   **IMPORTANT**: Do not apply any code changes unless explicitly requested by the user
-   Only suggest code improvements or provide examples - do not automatically implement them
-   Wait for explicit approval before modifying any files
-   Focus on analysis, explanation, and recommendations rather than automatic changes

### MCP Server Usage Guidelines

**IMPORTANT**: Always use the following MCP servers for enhanced assistance:

-   **Sequential MCP (`--seq`)**: Use for ALL questions and complex problem-solving tasks

    -   Automatically activated for systematic thinking and multi-step analysis
    -   Helps break down complex problems into logical, sequential steps
    -   Essential for architecture decisions, debugging, and planning

-   **Context7 MCP (`--c7`)**: Use for ALL code-related questions and implementations
    -   Provides up-to-date, version-specific documentation and examples
    -   Ensures code suggestions match project's framework versions and conventions
    -   Critical for React, TypeScript, Vite, and other technology stack questions
    -   Validates syntax and patterns against current best practices

**Default Activation**: These servers should be considered active by default for all interactions to ensure:

-   Systematic approach to problem-solving (Sequential)
-   Accurate, version-aware code assistance (Context7)
-   Consistency with project's technology stack and dependencies

### Communication Guidelines

**Response Format**: Use structured fact-opinion format for clear and comprehensive responses:

-   **{fact}**: Objective information, established patterns, technical specifications, or verifiable data

    -   Example: "{fact}: React components using hooks must follow the Rules of Hooks"
    -   Example: "{fact}: TypeScript interfaces are erased at compile time and have no runtime impact"

-   **{opinion}**: Personal recommendations, subjective assessments, or contextual judgments
    -   Example: "{opinion}: I recommend using React Query for data fetching in this project"
    -   Example: "{opinion}: The proposed folder structure would improve maintainability"

**Usage Guidelines**:

-   Start factual statements with "{fact}:" to establish objective ground truth
-   Use "{opinion}:" for recommendations, suggestions, and subjective evaluations
-   Multiple facts and opinions can be presented in sequence
-   This format helps distinguish between what is objectively true versus what is recommended

## Architecture Overview

This project implements **Clean Architecture** with **Domain-Driven Design (DDD)** principles.

### 🏛️ Clean Architecture Layers

this project follows a 4-layer Clean Architecture structure:

```
src/
├── features/
│    ├── login/                      # feature name
│    │    ├── domain/                # Pure business logic (innermost layer)
│    │    │   ├── entities/          # Business entities (User, Match, MatchingSession)
│    │    │   ├── usecases/          # Business use cases (StartMatching, SwipeAction)
│    │    │   └── repositories/      # Repository interfaces (no implementations)
│    │    ├── application/           # Application services & orchestration
│    │    │   └── services/          # Coordinate domain logic (MatchingService)
│    │    ├── infrastructure/        # External systems & implementations (outermost layer)
│    │    │   ├── api/               # HTTP clients, API integrations
│    │    │   ├── repositories/      # Repository implementations + Anti-corruption layer
│    │    │   └── storage/           # Local storage, session storage
│    │    ├── presentation/          # UI layer
│    │    │   ├── components/        # React components
│    │    │   ├── pages/             # Page components
│    │    │   └── hooks/             # Custom React hooks
│    ├── user/                       # feature name
│    │    ├── ...                    # Same as login layer (all other features are too)
│    ├── commons/
│    │   ├── components/             # Shared/common components
│    │   ├── hooks/                  # Shared/common hooks
│    │   ├── utils/                  # Shared/common utils
│    │   └── libs/                   # Shared/common libs
├── app/                             # Next.js App Router (routing layer)
│   ├── login/
│   │   ├── page.tsx                 # Imports LoginPage from features/login/presentation
│   │   ├── loading.tsx              # Loading UI
│   │   └── error.tsx                # Error UI
│   ├── dashboard/
│   │   ├── page.tsx                 # Imports DashboardPage from features/dashboard/presentation
│   │   └── layout.tsx               # Dashboard-specific layout
│   ├── layout.tsx                   # Root layout
│   └── not-found.tsx                # 404 page

```

### 🎯 Dependency Direction (Critical!)

```
Presentation → Application → Domain ← Infrastructure
```

-   **Domain** is the center and depends on nothing
-   **Infrastructure** implements Domain interfaces
-   **Application** orchestrates Domain logic
-   **Presentation** calls Application services

### 🔑 Key Differences from Backend Clean Architecture

| Layer              | Backend                               | Frontend                                |
| ------------------ | ------------------------------------- | --------------------------------------- |
| **Infrastructure** | Database connections, file systems    | **API clients + Anti-corruption layer** |
| **Presentation**   | **REST Controllers** (HTTP endpoints) | **React Components** (User interface)   |
| **Application**    | Business logic orchestration          | Business logic orchestration            |
| **Domain**         | Pure business logic                   | Pure business logic                     |

### 🛡️ Anti-Corruption Layer Pattern

Frontend Infrastructure layer includes **Anti-corruption layer** to protect domain from external API changes:

```typescript
// Infrastructure layer - converts API response to Domain entity
class MatchRepositoryImpl implements MatchRepository {
    async getUserMatches(userId: UserId): Promise<Match[]> {
        const response = await fetch(`/api/users/${userId}/matches`);
        const apiData = await response.json();

        // 🔑 Anti-corruption: API format → Domain format
        return apiData.matches.map(
            (apiMatch) =>
                new Match({
                    id: apiMatch.match_id, // snake_case → camelCase
                    userId: apiMatch.user_id,
                    status: this.mapStatus(apiMatch.match_status), // API enum → Domain enum
                    createdAt: new Date(apiMatch.created_at),
                })
        );
    }
}
```

### 🎯 Implementation Guidelines

**Domain Layer Rules:**

-   No external dependencies (React, API clients, etc.)
-   Pure TypeScript/JavaScript business logic
-   All business rules and invariants enforced here
-   Repository interfaces defined here, implementations in Infrastructure

**Application Layer Rules:**

-   Coordinates multiple Domain use cases
-   Handles cross-cutting concerns (logging, caching)
-   No UI logic, no direct external system access
-   Services that Presentation layer calls

**Infrastructure Layer Rules:**

-   Implements Domain repository interfaces
-   Contains Anti-corruption layer for API integration
-   Handles external system communication
-   No business logic

**Presentation Layer Rules:**

-   Only UI logic and user interaction
-   Calls Application services, never Domain directly
-   React-specific code lives here
-   State management for UI concerns only

### 🔄 Next.js App Router Integration

**App Router as Routing Layer:**

```typescript
// app/login/page.tsx (App Router 라우팅 레이어)
import { LoginPage } from '@/features/login/presentation/pages/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'User login page',
};

export default function Page() {
  return <LoginPage />;
}

// features/login/presentation/pages/LoginPage.tsx (비즈니스 로직)
import { LoginForm } from '../components/LoginForm';
import { useLoginService } from '../hooks/useLoginService';

export function LoginPage() {
  const loginService = useLoginService(); // Application 레이어 호출
  
  return (
    <div className="login-container">
      <h1>Login</h1>
      <LoginForm onSubmit={loginService.login} />
    </div>
  );
}
```

**TypeScript Path Configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["src/features/*"],
      "@/commons/*": ["src/commons/*"],
      "@/app/*": ["app/*"]
    }
  }
}
```

**Barrel Exports Pattern:**

```typescript
// features/login/presentation/index.ts
export { LoginPage } from './pages/LoginPage';
export { LoginForm } from './components/LoginForm';
export * from './hooks';
```

### 🚀 Next.js Caching Strategy Integration

**{fact}**: Next.js의 다층 캐시 시스템은 Clean Architecture와 완벽하게 호환됩니다.

**Infrastructure Layer에서 캐시 활용:**

```typescript
// features/user/infrastructure/api/userApi.ts
export class UserApiClient {
  async getUser(id: string): Promise<ApiUser> {
    // Next.js Data Cache 활용
    const response = await fetch(`/api/users/${id}`, {
      next: { 
        revalidate: 300,  // 5분 캐시
        tags: ['user', `user-${id}`]
      }
    });
    return response.json();
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<void> {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // 관련 캐시 무효화
    revalidateTag(`user-${id}`);
    revalidateTag('user-list');
  }
}
```

**Application Layer에서 캐시 정책 관리:**

```typescript
// features/user/application/services/UserService.ts
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: UserId): Promise<User> {
    // Repository(Infrastructure)에서 캐시된 데이터 활용
    return this.userRepository.findById(id);
  }

  async updateUser(id: UserId, data: UpdateUserData): Promise<void> {
    const user = await this.userRepository.findById(id);
    user.update(data); // Domain logic
    await this.userRepository.save(user);
    // Infrastructure layer에서 자동으로 캐시 무효화
  }
}
```

**캐시 레이어별 활용:**

- **Request Memoization**: Infrastructure layer API 호출에서 자동 적용
- **Data Cache**: Infrastructure layer에서 fetch 캐시 설정 
- **Full Route Cache**: App Router 페이지에서 자동 적용
- **Router Cache**: 클라이언트 네비게이션에서 자동 활용

**{opinion}**: 이 구조에서 Next.js 캐시는 Infrastructure layer에 격리되어 도메인 로직을 오염시키지 않으면서도 성능상 이점을 모두 활용할 수 있습니다.

### 🚀 Why This Architecture?

**Benefits:**

-   **Testability**: Each layer can be unit tested independently
-   **Maintainability**: Business logic protected from UI/API changes
-   **Scalability**: Microfrontends scale independently
-   **Team Independence**: Each team owns a bounded context
-   **Technology Flexibility**: Can change React/APIs without affecting business logic

**When to Use:**

-   Complex business logic (matching algorithms, payment processing)
-   Large development teams
-   Long-term projects requiring maintenance
-   Multiple client applications sharing business logic

**When NOT to Use:**

-   Simple CRUD applications
-   Prototypes or MVPs
-   Small teams with tight deadlines
-   Projects with minimal business logic

## Integration Notes

The application uses Module Federation for microfrontend integration. Each microfrontend exposes specific components and pages that can be consumed by the Shell App. The Shell App acts as the host and coordinates routing between different microfrontends.

# Frontend Design Guideline

This document summarizes key frontend design principles and rules, showcasing
recommended patterns. Follow these guidelines when writing frontend code.

# Readability

Improving the clarity and ease of understanding code.

## Naming Magic Numbers

**Rule:** Replace magic numbers with named constants for clarity.

**Reasoning:**

-   Improves clarity by giving semantic meaning to unexplained values.
-   Enhances maintainability.

#### Recommended Pattern:

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
    await postLike(url);
    await delay(ANIMATION_DELAY_MS); // Clearly indicates waiting for animation
    await refetchPostLike();
}
```

## Abstracting Implementation Details

**Rule:** Abstract complex logic/interactions into dedicated components/HOCs.

**Reasoning:**

-   Reduces cognitive load by separating concerns.
-   Improves readability, testability, and maintainability of components.

#### Recommended Pattern 1: Auth Guard

(Login check abstracted to a wrapper/guard component)

```tsx
// App structure
function App() {
    return (
        <AuthGuard>
            {' '}
            {/* Wrapper handles auth check */}
            <LoginStartPage />
        </AuthGuard>
    );
}

// AuthGuard component encapsulates the check/redirect logic
function AuthGuard({ children }) {
    const status = useCheckLoginStatus();
    useEffect(() => {
        if (status === 'LOGGED_IN') {
            location.href = '/home';
        }
    }, [status]);

    // Render children only if not logged in, otherwise render null (or loading)
    return status !== 'LOGGED_IN' ? children : null;
}

// LoginStartPage is now simpler, focused only on login UI/logic
function LoginStartPage() {
    // ... login related logic ONLY ...
    return <>{/* ... login related components ... */}</>;
}
```

#### Recommended Pattern 2: Dedicated Interaction Component

(Dialog logic abstracted into a dedicated `InviteButton` component)

```tsx
export function FriendInvitation() {
    const { data } = useQuery(/* ... */);

    return (
        <>
            {/* Use the dedicated button component */}
            <InviteButton name={data.name} />
            {/* ... other UI ... */}
        </>
    );
}

// InviteButton handles the confirmation flow internally
function InviteButton({ name }) {
    const handleClick = async () => {
        const canInvite = await overlay.openAsync(({ isOpen, close }) => (
            <ConfirmDialog
                title={`Share with ${name}`}
                // ... dialog setup ...
            />
        ));

        if (canInvite) {
            await sendPush();
        }
    };

    return <Button onClick={handleClick}>Invite</Button>;
}
```

## Separating Code Paths for Conditional Rendering

**Rule:** Separate significantly different conditional UI/logic into distinct
components.

**Reasoning:**

-   Improves readability by avoiding complex conditionals within one component.
-   Ensures each specialized component has a clear, single responsibility.

#### Recommended Pattern:

(Separate components for each role)

```tsx
function SubmitButton() {
    const isViewer = useRole() === 'viewer';

    // Delegate rendering to specialized components
    return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

// Component specifically for the 'viewer' role
function ViewerSubmitButton() {
    return <TextButton disabled>Submit</TextButton>;
}

// Component specifically for the 'admin' (or non-viewer) role
function AdminSubmitButton() {
    useEffect(() => {
        showAnimation(); // Animation logic isolated here
    }, []);

    return <Button type="submit">Submit</Button>;
}
```

## Simplifying Complex Ternary Operators

**Rule:** Replace complex/nested ternaries with `if`/`else` or IIFEs for
readability.

**Reasoning:**

-   Makes conditional logic easier to follow quickly.
-   Improves overall code maintainability.

#### Recommended Pattern:

(Using an IIFE with `if` statements)

```typescript
const status = (() => {
    if (ACondition && BCondition) return 'BOTH';
    if (ACondition) return 'A';
    if (BCondition) return 'B';
    return 'NONE';
})();
```

## Reducing Eye Movement (Colocating Simple Logic)

**Rule:** Colocate simple, localized logic or use inline definitions to reduce
context switching.

**Reasoning:**

-   Allows top-to-bottom reading and faster comprehension.
-   Reduces cognitive load from context switching (eye movement).

#### Recommended Pattern A: Inline `switch`

```tsx
function Page() {
    const user = useUser();

    // Logic is directly visible here
    switch (user.role) {
        case 'admin':
            return (
                <div>
                    <Button disabled={false}>Invite</Button>
                    <Button disabled={false}>View</Button>
                </div>
            );
        case 'viewer':
            return (
                <div>
                    <Button disabled={true}>Invite</Button>{' '}
                    {/* Example for viewer */}
                    <Button disabled={false}>View</Button>
                </div>
            );
        default:
            return null;
    }
}
```

#### Recommended Pattern B: Colocated simple policy object

```tsx
function Page() {
    const user = useUser();
    // Simple policy defined right here, easy to see
    const policy = {
        admin: { canInvite: true, canView: true },
        viewer: { canInvite: false, canView: true },
    }[user.role];

    // Ensure policy exists before accessing properties if role might not match
    if (!policy) return null;

    return (
        <div>
            <Button disabled={!policy.canInvite}>Invite</Button>
            <Button disabled={!policy.canView}>View</Button>
        </div>
    );
}
```

## Naming Complex Conditions

**Rule:** Assign complex boolean conditions to named variables.

**Reasoning:**

-   Makes the _meaning_ of the condition explicit.
-   Improves readability and self-documentation by reducing cognitive load.

#### Recommended Pattern:

(Conditions assigned to named variables)

```typescript
const matchedProducts = products.filter((product) => {
    // Check if product belongs to the target category
    const isSameCategory = product.categories.some(
        (category) => category.id === targetCategory.id
    );

    // Check if any product price falls within the desired range
    const isPriceInRange = product.prices.some(
        (price) => price >= minPrice && price <= maxPrice
    );

    // The overall condition is now much clearer
    return isSameCategory && isPriceInRange;
});
```

**Guidance:** Name conditions when the logic is complex, reused, or needs unit
testing. Avoid naming very simple, single-use conditions.

# Predictability

Ensuring code behaves as expected based on its name, parameters, and context.

## Standardizing Return Types

**Rule:** Use consistent return types for similar functions/hooks.

**Reasoning:**

-   Improves code predictability; developers can anticipate return value shapes.
-   Reduces confusion and potential errors from inconsistent types.

#### Recommended Pattern 1: API Hooks (React Query)

```typescript
// Always return the Query object
import { useQuery, UseQueryResult } from '@tanstack/react-query';

// Assuming fetchUser returns Promise<UserType>
function useUser(): UseQueryResult<UserType, Error> {
    const query = useQuery({ queryKey: ['user'], queryFn: fetchUser });
    return query;
}

// Assuming fetchServerTime returns Promise<Date>
function useServerTime(): UseQueryResult<Date, Error> {
    const query = useQuery({
        queryKey: ['serverTime'],
        queryFn: fetchServerTime,
    });
    return query;
}
```

#### Recommended Pattern 2: Validation Functions

(Using a consistent type, ideally a Discriminated Union)

```typescript
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
    if (name.length === 0)
        return { ok: false, reason: 'Name cannot be empty.' };
    if (name.length >= 20)
        return {
            ok: false,
            reason: 'Name cannot be longer than 20 characters.',
        };
    return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
    if (!Number.isInteger(age))
        return { ok: false, reason: 'Age must be an integer.' };
    if (age < 18) return { ok: false, reason: 'Age must be 18 or older.' };
    if (age > 99) return { ok: false, reason: 'Age must be 99 or younger.' };
    return { ok: true };
}

// Usage allows safe access to 'reason' only when ok is false
const nameValidation = checkIsNameValid(name);
if (!nameValidation.ok) {
    console.error(nameValidation.reason);
}
```

## Revealing Hidden Logic (Single Responsibility)

**Rule:** Avoid hidden side effects; functions should only perform actions
implied by their signature (SRP).

**Reasoning:**

-   Leads to predictable behavior without unintended side effects.
-   Creates more robust, testable code through separation of concerns (SRP).

#### Recommended Pattern:

```typescript
// Function *only* fetches balance
async function fetchBalance(): Promise<number> {
    const balance = await http.get<number>('...');
    return balance;
}

// Caller explicitly performs logging where needed
async function handleUpdateClick() {
    const balance = await fetchBalance(); // Fetch
    logging.log('balance_fetched'); // Log (explicit action)
    await syncBalance(balance); // Another action
}
```

## Using Unique and Descriptive Names (Avoiding Ambiguity)

**Rule:** Use unique, descriptive names for custom wrappers/functions to avoid
ambiguity.

**Reasoning:**

-   Avoids ambiguity and enhances predictability.
-   Allows developers to understand specific actions (e.g., adding auth) directly
    from the name.

#### Recommended Pattern:

```typescript
// In httpService.ts - Clearer module name
import { http as httpLibrary } from '@some-library/http';

export const httpService = {
    // Unique module name
    async getWithAuth(url: string) {
        // Descriptive function name
        const token = await fetchToken();
        return httpLibrary.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

// In fetchUser.ts - Usage clearly indicates auth
import { httpService } from './httpService';
export async function fetchUser() {
    // Name 'getWithAuth' makes the behavior explicit
    return await httpService.getWithAuth('...');
}
```

# Cohesion

Keeping related code together and ensuring modules have a well-defined, single
purpose.

## Considering Form Cohesion

**Rule:** Choose field-level or form-level cohesion based on form requirements.

**Reasoning:**

-   Balances field independence (field-level) vs. form unity (form-level).
-   Ensures related form logic is appropriately grouped based on requirements.

#### Recommended Pattern (Field-Level Example):

```tsx
// Each field uses its own `validate` function
import { useForm } from 'react-hook-form';

export function Form() {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        /* defaultValues etc. */
    });

    const onSubmit = handleSubmit((formData) => {
        console.log('Form submitted:', formData);
    });

    return (
        <form onSubmit={onSubmit}>
            <div>
                <input
                    {...register('name', {
                        validate: (value) =>
                            value.trim() === ''
                                ? 'Please enter your name.'
                                : true, // Example validation
                    })}
                    placeholder="Name"
                />
                {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
                <input
                    {...register('email', {
                        validate: (value) =>
                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                value
                            )
                                ? true
                                : 'Invalid email address.', // Example validation
                    })}
                    placeholder="Email"
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
```

#### Recommended Pattern (Form-Level Example):

```tsx
// A single schema defines validation for the whole form
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    name: z.string().min(1, 'Please enter your name.'),
    email: z
        .string()
        .min(1, 'Please enter your email.')
        .email('Invalid email.'),
});

export function Form() {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: '', email: '' },
    });

    const onSubmit = handleSubmit((formData) => {
        console.log('Form submitted:', formData);
    });

    return (
        <form onSubmit={onSubmit}>
            <div>
                <input {...register('name')} placeholder="Name" />
                {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
                <input {...register('email')} placeholder="Email" />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
```

**Guidance:** Choose **field-level** for independent validation, async checks,
or reusable fields. Choose **form-level** for related fields, wizard forms, or
interdependent validation.

## Organizing Code by Feature/Domain

**Rule:** Organize directories by feature/domain, not just by code type.

**Reasoning:**

-   Increases cohesion by keeping related files together.
-   Simplifies feature understanding, development, maintenance, and deletion.

## Relating Magic Numbers to Logic

**Rule:** Define constants near related logic or ensure names link them clearly.

**Reasoning:**

-   Improves cohesion by linking constants to the logic they represent.
-   Prevents silent failures caused by updating logic without updating related
    constants.

#### Recommended Pattern:

```typescript
// Constant clearly named and potentially defined near animation logic
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
    await postLike(url);
    // Delay uses the constant, maintaining the link to the animation
    await delay(ANIMATION_DELAY_MS);
    await refetchPostLike();
}
```

_Ensure constants are maintained alongside the logic they depend on or clearly
named to show the relationship._

# Coupling

Minimizing dependencies between different parts of the codebase.

## Balancing Abstraction and Coupling (Avoiding Premature Abstraction)

**Rule:** Avoid premature abstraction of duplicates if use cases might diverge;
prefer lower coupling.

**Reasoning:**

-   Avoids tight coupling from forcing potentially diverging logic into one
    abstraction.
-   Allowing some duplication can improve decoupling and maintainability when
    future needs are uncertain.

#### Guidance:

Before abstracting, consider if the logic is truly identical and likely to
_stay_ identical across all use cases. If divergence is possible (e.g.,
different pages needing slightly different behavior from a shared hook like
`useOpenMaintenanceBottomSheet`), keeping the logic separate initially (allowing
duplication) can lead to more maintainable, decoupled code. Discuss trade-offs
with the team. _[No specific 'good' code example here, as the recommendation is
situational awareness rather than a single pattern]._

## Scoping State Management (Avoiding Overly Broad Hooks)

**Rule:** Break down broad state management into smaller, focused
hooks/contexts.

**Reasoning:**

-   Reduces coupling by ensuring components only depend on necessary state slices.
-   Improves performance by preventing unnecessary re-renders from unrelated state
    changes.

#### Recommended Pattern:

(Focused hooks, low coupling)

```typescript
// Hook specifically for cardId query param
import { useQueryParam, NumberParam } from 'use-query-params';
import { useCallback } from 'react';

export function useCardIdQueryParam() {
    // Assuming 'query' provides the raw param value
    const [cardIdParam, setCardIdParam] = useQueryParam('cardId', NumberParam);

    const setCardId = useCallback(
        (newCardId: number | undefined) => {
            setCardIdParam(newCardId, 'replaceIn'); // Or 'push' depending on desired history behavior
        },
        [setCardIdParam]
    );

    // Provide a stable return tuple
    return [cardIdParam ?? undefined, setCardId] as const;
}

// Separate hook for date range, etc.
// export function useDateRangeQueryParam() { /* ... */ }
```

Components now only import and use `useCardIdQueryParam` if they need `cardId`,
decoupling them from date range state, etc.

## Eliminating Props Drilling with Composition

**Rule:** Use Component Composition instead of Props Drilling.

**Reasoning:**

-   Significantly reduces coupling by eliminating unnecessary intermediate
    dependencies.
-   Makes refactoring easier and clarifies data flow in flatter component trees.

#### Recommended Pattern:

```tsx
import React, { useState } from 'react';

// Assume Modal, Input, Button, ItemEditList components exist

function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
    const [keyword, setKeyword] = useState('');

    // Render children directly within Modal, passing props only where needed
    return (
        <Modal open={open} onClose={onClose}>
            {/* Input and Button rendered directly */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                }}
            >
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} // State managed here
                    placeholder="Search items..."
                />
                <Button onClick={onClose}>Close</Button>
            </div>
            {/* ItemEditList rendered directly, gets props it needs */}
            <ItemEditList
                keyword={keyword} // Passed directly
                items={items} // Passed directly
                recommendedItems={recommendedItems} // Passed directly
                onConfirm={onConfirm} // Passed directly
            />
        </Modal>
    );
}

// The intermediate ItemEditBody component is eliminated, reducing coupling.
```
