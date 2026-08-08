import { apiFetch } from "@/lib/api-client";
import type { PageResponse } from "@/pages/applications/types";
import type { AuditLogFilters, AuditLogResponseDTO } from "@/pages/logs/types";

function buildQueryString(filters: AuditLogFilters): string {
	const params = new URLSearchParams();

	if (filters.search) params.set("search", filters.search);
	if (filters.id) params.set("id", filters.id);
	if (filters.applicationId) params.set("applicationId", filters.applicationId);
	if (filters.actorId) params.set("actorId", filters.actorId);
	if (filters.actorName) params.set("actorName", filters.actorName);
	if (filters.actorIp) params.set("actorIp", filters.actorIp);
	if (filters.actorUserAgent) params.set("actorUserAgent", filters.actorUserAgent);
	if (filters.action) params.set("action", filters.action);
	if (filters.resourceType) params.set("resourceType", filters.resourceType);
	if (filters.resourceId) params.set("resourceId", filters.resourceId);
	if (filters.severity) params.set("severity", filters.severity);
	if (filters.occurredAtFrom) params.set("occurredAtFrom", filters.occurredAtFrom);
	if (filters.occurredAtTo) params.set("occurredAtTo", filters.occurredAtTo);
	if (filters.createdFrom) params.set("createdFrom", filters.createdFrom);
	if (filters.createdTo) params.set("createdTo", filters.createdTo);
	params.set("page", String(filters.page ?? 0));
	params.set("size", String(filters.size ?? 10));
	filters.sort?.forEach((s) => {
		params.append("sort", s);
	});

	return params.toString();
}

export function listAuditLogs(filters: AuditLogFilters) {
	return apiFetch<PageResponse<AuditLogResponseDTO>>(`/audit-logs?${buildQueryString(filters)}`);
}

export function getAuditLog(id: string) {
	return apiFetch<AuditLogResponseDTO>(`/audit-logs/${id}`);
}
