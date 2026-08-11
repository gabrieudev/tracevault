import type { AppRouteStaticData } from "@/components/layout/AppLayout";
import { AuditLogsPage } from "@/pages/logs/AuditLogsPage";
import { AUDIT_ACTIONS } from "@/pages/logs/types";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const logsSearchSchema = z.object({
	page: z.number().catch(0).optional(),
	search: z.string().optional(),
	applicationId: z.string().optional(),
	action: z.enum(AUDIT_ACTIONS).optional(),
	severity: z.enum(["ALL", "INFO", "WARNING", "CRITICAL"]).optional(),
	actorId: z.string().optional(),
	resourceType: z.string().optional(),
	occurredFrom: z.string().optional(),
	occurredTo: z.string().optional(),
	id: z.string().optional(),
});

export type LogsSearch = z.infer<typeof logsSearchSchema>;

export const Route = createFileRoute("/_app/logs/")({
	validateSearch: (search) => logsSearchSchema.parse(search),
	component: AuditLogsPage,
	staticData: {
		title: "Logs de Auditoria",
		subtitle: "Motor de busca e rastreabilidade de eventos",
	} satisfies AppRouteStaticData,
});
