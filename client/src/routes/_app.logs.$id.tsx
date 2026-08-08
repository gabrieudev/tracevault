import type { AppRouteStaticData } from "@/components/layout/AppLayout";
import { LogDetailPage } from "@/pages/logs/log-detail/LogDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/logs/$id")({
	component: LogDetailPage,
	staticData: {
		title: "Detalhes do evento",
		subtitle: "Auditoria completa com comparação de estado",
	} satisfies AppRouteStaticData,
});
