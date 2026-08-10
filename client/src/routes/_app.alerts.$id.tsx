import type { AppRouteStaticData } from "@/components/layout/AppLayout";
import { AlertDetailPage } from "@/pages/alerts/alert-detail/AlertDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/alerts/$id")({
	component: AlertDetailPage,
	staticData: {
		title: "Detalhes do alerta",
		subtitle: "Configuração da integração de alertas",
	} satisfies AppRouteStaticData,
});
