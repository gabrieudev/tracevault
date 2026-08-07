// Ajuste a URL base conforme seu setup (ex: variável de ambiente do Vite).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
	/** Usado nos endpoints que autenticam via header X-API-Key (ex: rotação de chave). */
	apiKey?: string;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { body, apiKey, headers, ...rest } = options;

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...rest,
		headers: {
			"Content-Type": "application/json",
			...(apiKey ? { "X-API-Key": apiKey } : {}),
			// Se a Management API usar Bearer Token, plugue aqui, ex:
			// Authorization: `Bearer ${getStoredToken()}`,
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const message = await response.text().catch(() => "");
		throw new ApiError(message || response.statusText, response.status);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return (await response.json()) as T;
}
