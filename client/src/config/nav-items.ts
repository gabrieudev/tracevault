import { LayoutDashboard, Boxes, ScrollText, Webhook, LifeBuoy, HelpCircle, type LucideIcon } from "lucide-react";

export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	description: string;
}

export const primaryNav: NavItem[] = [
	{
		label: "Dashboard",
		href: "/",
		icon: LayoutDashboard,
		description: "Visão geral do volume de logs e taxas de erro",
	},
	{
		label: "Aplicações",
		href: "/applications",
		icon: Boxes,
		description: "Gerenciamento dos tenants que enviam eventos",
	},
	{
		label: "Logs de Auditoria",
		href: "/logs",
		icon: ScrollText,
		description: "Motor de busca e rastreabilidade de eventos",
	},
	{
		label: "Webhooks",
		href: "/webhooks",
		icon: Webhook,
		description: "Integrações e alertas automáticos",
	},
	{
		label: "Chamados",
		href: "/chamados",
		icon: LifeBuoy,
		description: "Central de suporte",
	},
	{
		label: "FAQ",
		href: "/faq",
		icon: HelpCircle,
		description: "Base de conhecimento e documentação de integração",
	},
];
