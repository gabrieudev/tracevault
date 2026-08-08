import { useQuery } from "@tanstack/react-query";
import { listApplications } from "@/lib/api/applications";

export function useApplicationsForFilter() {
	return useQuery({
		queryKey: ["applications", "for-filter"],
		queryFn: () => listApplications({ page: 0, size: 100, sort: ["name,asc"] }),
		staleTime: 60_000,
	});
}
