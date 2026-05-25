const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseText?: string
  ) {
    super(message);
  }
}

export async function apiClient<T>(
  path: string,
  init?: RequestInit & { token?: string | null }
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("Missing EXPO_PUBLIC_API_BASE_URL");
  }

  const { token, headers, ...requestInit } = init ?? {};

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => undefined);
    throw new ApiClientError(
      responseText || "API request failed",
      response.status,
      responseText
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
