import { apiFetch } from "@/lib/api-client";
import type {
	ApplicationFilters,
	ApplicationRequestDTO,
	ApplicationResponseDTO,
	PageResponse,
	PlainKeyResponseDTO,
	UpdateApplicationDTO,
} from "@/pages/applications/types";

function buildQueryString(filters: ApplicationFilters): string {
	const params = new URLSearchParams();

	if (filters.id) params.set("id", filters.id);
	if (filters.search) params.set("search", filters.search);
	if (filters.name) params.set("name", filters.name);
	if (filters.description) params.set("description", filters.description);
	filters.status?.forEach((status) => {
		params.append("status", status);
	});
	if (filters.createdFrom) params.set("createdFrom", filters.createdFrom);
	if (filters.createdTo) params.set("createdTo", filters.createdTo);
	if (filters.updatedFrom) params.set("updatedFrom", filters.updatedFrom);
	if (filters.updatedTo) params.set("updatedTo", filters.updatedTo);
	params.set("page", String(filters.page ?? 0));
	params.set("size", String(filters.size ?? 10));
	filters.sort?.forEach((s) => {
		params.append("sort", s);
	});

	return params.toString();
}

export function listApplications(filters: ApplicationFilters) {
	return apiFetch<PageResponse<ApplicationResponseDTO>>(`/applications?${buildQueryString(filters)}`);
}

export function getApplication(id: string) {
	return apiFetch<ApplicationResponseDTO>(`/applications/${id}`);
}

export function createApplication(data: ApplicationRequestDTO) {
	return apiFetch<PlainKeyResponseDTO>("/applications", {
		method: "POST",
		body: data,
	});
}

export function updateApplication(id: string, data: UpdateApplicationDTO) {
	return apiFetch<ApplicationResponseDTO>(`/applications/${id}`, {
		method: "PUT",
		body: data,
	});
}

export function rotateApiKey(id: string, currentApiKey: string) {
	return apiFetch<PlainKeyResponseDTO>(`/applications/${id}/rotate-key`, {
		method: "POST",
		apiKey: currentApiKey,
	});
}
