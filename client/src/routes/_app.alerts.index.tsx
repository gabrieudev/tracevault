import type { AppRouteStaticData } from "@/components/layout/AppLayout";
import { AlertsPage } from "@/pages/alerts/AlertsPage";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const alertsSearchSchema = z.object({
	page: z.number().catch(0).optional(),
	search: z.string().optional(),
	applicationId: z.string().optional(),
	channelType: z.enum(["WEBHOOK", "SLACK", "EMAIL", "DISCORD"]).optional(),
	minSeverity: z.enum(["INFO", "WARNING", "CRITICAL"]).optional(),
	active: z.boolean().optional(),
});

export type AlertsSearch = z.infer<typeof alertsSearchSchema>;

export const Route = createFileRoute("/_app/alerts/")({
	validateSearch: (search) => alertsSearchSchema.parse(search),
	component: AlertsPage,
	staticData: {
		title: "Alertas",
		subtitle: "Gerenciamento de integrações e alertas automáticos",
	} satisfies AppRouteStaticData,
});
