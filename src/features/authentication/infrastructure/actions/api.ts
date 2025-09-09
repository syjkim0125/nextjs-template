'use server';

import { refreshAccessTokenAction } from './auth';

// API Client (Server Actions)
// - 단일 진입점: apiFetch / apiJson
// - 명시적 baseUrl과 token 전달
// - 401 시에만 refresh 토큰으로 재시도(1회)
// 주의: 순환 의존성 방지를 위해 refresh는 동적 import로 불러옵니다.

export interface ApiFetchParams {
    baseUrl: string; // 예: http://localhost:8080 또는 http://localhost:3001
    endpoint: string; // 예: /api/users, /user/me
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    token?: string; // 액세스 토큰(옵션)
    headers?: Record<string, string>;
    body?: unknown; // 객체면 JSON 직렬화
    autoRefreshOn401?: boolean; // 기본 true
}

// 저수준 fetch: Response 그대로 반환
export const apiFetch = async ({
    baseUrl,
    endpoint,
    method = 'GET',
    token,
    headers = {},
    body,
    autoRefreshOn401 = true,
}: ApiFetchParams): Promise<Response> => {
    const url = `${baseUrl}${endpoint}`;

    const reqInit: RequestInit = {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
            ...headers,
        },
        body:
            body !== undefined && body !== null && method !== 'GET'
                ? typeof body === 'string'
                    ? body
                    : JSON.stringify(body)
                : undefined,
    };

    let res = await fetch(url, reqInit);

    // 401 처리: 필요 시 1회 refresh 후 재시도
    if (res.status === 401 && autoRefreshOn401) {
        const refreshed = await refreshAccessTokenAction();
        if (refreshed.success && refreshed.accessToken) {
            const retryInit: RequestInit = {
                ...reqInit,
                headers: {
                    ...(reqInit.headers as Record<string, string>),
                    Authorization: `Bearer ${refreshed.accessToken}`,
                },
            };
            res = await fetch(url, retryInit);
        }
    }

    return res;
};

// 고수준: JSON 응답 파싱 + 에러 처리
export async function apiJson<T = unknown>(params: ApiFetchParams): Promise<T> {
    const res = await apiFetch(params);
    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }
    return res.json() as Promise<T>;
}
