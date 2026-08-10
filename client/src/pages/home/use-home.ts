import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/lib/api/home";
import type { HomeFilters } from "./types";

export const homeKeys = {
	all: ["home"] as const,
	summaries: () => [...homeKeys.all, "summary"] as const,
	summary: (filters: HomeFilters) => [...homeKeys.summaries(), filters] as const,
};

export function useHomeSummary(filters: HomeFilters = {}) {
	return useQuery({
		queryKey: homeKeys.summary(filters),
		queryFn: () => getDashboardSummary(filters),
		refetchInterval: 8000,
		placeholderData: (previous) => previous,
	});
}
