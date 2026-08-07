import type { AppRouteStaticData } from "@/components/layout/AppLayout";
import { ApplicationsPage } from "@/pages/applications/ApplicationsPage";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const applicationSearchSchema = z.object({
	page: z.number().catch(0).optional(),
	search: z.string().optional(),
	status: z.enum(["ALL", "ACTIVE", "INACTIVE"]).optional(),
});

export type ApplicationSearch = z.infer<typeof applicationSearchSchema>;

export const Route = createFileRoute("/_app/applications/")({
	validateSearch: (search) => applicationSearchSchema.parse(search),
	component: ApplicationsPage,
	staticData: {
		title: "Aplicações",
		subtitle: "Gerenciamento dos tenants que enviam logs de auditoria",
	} satisfies AppRouteStaticData,
});
