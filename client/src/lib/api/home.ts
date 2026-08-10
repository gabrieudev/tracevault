import { apiFetch } from "@/lib/api-client";
import type { HomeFilters, HomeSummaryResponseDTO } from "@/pages/home/types";

function buildHomeQueryString(filters: HomeFilters): string {
	const params = new URLSearchParams();

	if (filters.applicationId) {
		params.set("applicationId", filters.applicationId);
	}

	if (filters.pulseWindowMinutes !== undefined) {
		params.set("pulseWindowMinutes", String(filters.pulseWindowMinutes));
	}

	return params.toString();
}

export function getDashboardSummary(filters: HomeFilters) {
	const queryString = buildHomeQueryString(filters);
	const endpoint = queryString ? `/dashboard/summary?${queryString}` : "/dashboard/summary";

	return apiFetch<HomeSummaryResponseDTO>(endpoint);
}
