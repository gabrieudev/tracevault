import { useQuery } from "@tanstack/react-query";
import { getAuditLog, listAuditLogs } from "@/lib/api/audit-logs";
import type { AuditLogFilters } from "./types";

export const auditLogsKeys = {
	all: ["audit-logs"] as const,
	lists: () => [...auditLogsKeys.all, "list"] as const,
	list: (filters: AuditLogFilters) => [...auditLogsKeys.lists(), filters] as const,
	details: () => [...auditLogsKeys.all, "detail"] as const,
	detail: (id: string) => [...auditLogsKeys.details(), id] as const,
};

export function useAuditLogs(filters: AuditLogFilters) {
	return useQuery({
		queryKey: auditLogsKeys.list(filters),
		queryFn: () => listAuditLogs(filters),
		placeholderData: (previous) => previous,
	});
}

export function useAuditLog(id: string) {
	return useQuery({
		queryKey: auditLogsKeys.detail(id),
		queryFn: () => getAuditLog(id),
		enabled: Boolean(id),
	});
}
