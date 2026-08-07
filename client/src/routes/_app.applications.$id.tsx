import type { AppRouteStaticData } from "@/components/layout/AppLayout";
import { ApplicationDetailPage } from "@/pages/applications/application-detail/ApplicationDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/applications/$id")({
	component: ApplicationDetailPage,
	staticData: {
		title: "Detalhes da aplicação",
		subtitle: "Visualização e gerenciamento do tenant",
	} satisfies AppRouteStaticData,
});
