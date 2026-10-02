const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiClientError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

function normalizeApiErrorMessage(message: string): string {
  const compactMessage = message
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s--\s/g, ' ')
    .trim();

  return compactMessage.replace(/\.\s*Severity:\s*Error\.?$/i, '').trim();
}

function collectStringMessages(value: unknown, depth = 0): string[] {
  if (depth > 4 || value == null) return [];
  if (typeof value === 'string') {
    const message = value.trim();
    return message ? [message] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStringMessages(item, depth + 1));
  }
  if (typeof value === 'object') {
    return Object.values(value).flatMap((item) => collectStringMessages(item, depth + 1));
  }
  return [];
}

function getApiErrorMessage(errorBody: unknown, fallbackMessage: string): string {
  if (!errorBody || typeof errorBody !== 'object') {
    return fallbackMessage;
  }

  const body = errorBody as {
    message?: unknown;
    error?: unknown;
    Message?: unknown;
    Error?: unknown;
  };

  const candidate = body.message ?? body.error ?? body.Message ?? body.Error;

  if (typeof candidate === 'string' && candidate.trim()) {
    return normalizeApiErrorMessage(candidate);
  }

  const validationMessages = collectStringMessages(errorBody);
  if (validationMessages.length > 0) {
    return normalizeApiErrorMessage(validationMessages[0]);
  }

  return fallbackMessage;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const contentType = res.headers.get('content-type') ?? '';
  const isJsonResponse = contentType.includes('application/json');

  if (!res.ok) {
    if (isJsonResponse) {
      const errorBody = await res.json().catch(() => ({}));
      throw new ApiClientError(getApiErrorMessage(errorBody, res.statusText), res.status);
    }

    const errorText = await res.text().catch(() => '');
    const responseKind = contentType || 'unknown content type';
    const fallbackMessage = `Request failed (${res.status}). Expected JSON error payload, got ${responseKind}.`;
    throw new ApiClientError(errorText || fallbackMessage, res.status);
  }

  if (!isJsonResponse) {
    const responseKind = contentType || 'unknown content type';
    throw new ApiClientError(
      `Expected JSON response, got ${responseKind}. Check VITE_API_BASE_URL and backend endpoint.`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}
