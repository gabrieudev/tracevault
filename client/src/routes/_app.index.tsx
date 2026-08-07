import { Home } from "@/pages/home/HomePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
	component: Home,
	staticData: { title: "Dashboard", subtitle: "Visão geral do sistema de auditoria" },
});
