import { apiFetch } from "@/lib/api-client";
import type {
	AlertRuleFilters,
	AlertRuleRequestDTO,
	AlertRuleResponseDTO,
	UpdateAlertRuleDTO,
} from "@/pages/alerts/types";
import type { PageResponse } from "@/pages/applications/types";

function buildQueryString(filters: AlertRuleFilters): string {
	const params = new URLSearchParams();

	if (filters.id) params.set("id", filters.id);
	if (filters.search) params.set("search", filters.search);
	if (filters.applicationId) params.set("applicationId", filters.applicationId);
	if (filters.messageTemplate) params.set("messageTemplate", filters.messageTemplate);
	if (filters.channelType) params.set("channelType", filters.channelType);
	filters.triggerEvents?.forEach((event) => {
		params.append("triggerEvents", event);
	});
	if (filters.minSeverity) params.set("minSeverity", filters.minSeverity);
	if (filters.active !== undefined) params.set("active", String(filters.active));
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

export function listAlertRules(filters: AlertRuleFilters) {
	return apiFetch<PageResponse<AlertRuleResponseDTO>>(`/alert-rules?${buildQueryString(filters)}`);
}

export function getAlertRule(id: string) {
	return apiFetch<AlertRuleResponseDTO>(`/alert-rules/${id}`);
}

export function createAlertRule(data: AlertRuleRequestDTO) {
	const { applicationId, ...rest } = data;

	return apiFetch<AlertRuleResponseDTO>("/alert-rules", {
		method: "POST",
		body: { ...rest, application: { id: applicationId } },
	});
}

export function updateAlertRule(id: string, data: UpdateAlertRuleDTO) {
	return apiFetch<AlertRuleResponseDTO>(`/alert-rules/${id}`, {
		method: "PUT",
		body: data,
	});
}
