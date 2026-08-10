import { Home } from "@/pages/home/HomePage";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const dashboardSearchSchema = z.object({
	applicationId: z.string().optional(),
});

export const Route = createFileRoute("/_app/")({
	validateSearch: (search) => dashboardSearchSchema.parse(search),
	component: Home,
	staticData: { title: "Dashboard", subtitle: "Visão geral do sistema de auditoria" },
});
