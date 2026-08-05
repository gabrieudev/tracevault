import { AuditPulse } from "@/components/dashboard/AuditPulse";
import { SeverityBadge, type Severity } from "@/components/dashboard/SeverityBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Boxes, KeyRound, ShieldAlert } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
	component: Home,
	staticData: { title: "Dashboard", subtitle: "Visão geral do sistema de auditoria" },
});

const stats = [
	{
		label: "Eventos hoje",
		value: "35.890",
		icon: Activity,
		delta: { value: "+12,4%", direction: "up" as const, tone: "positive" as const },
	},
	{
		label: "Aplicações ativas",
		value: "4/5",
		icon: Boxes,
	},
	{
		label: "Alertas críticos (24h)",
		value: "7",
		icon: ShieldAlert,
		delta: { value: "+3", direction: "up" as const, tone: "negative" as const },
	},
	{
		label: "Falhas de login (24h)",
		value: "23",
		icon: KeyRound,
		delta: { value: "-18%", direction: "down" as const, tone: "positive" as const },
	},
];

const applications = [
	{ name: "Portal do Cliente", events: 18420, pct: 100 },
	{ name: "Painel Administrativo", events: 9310, pct: 51 },
	{ name: "Microsserviço de Pagamentos", events: 6120, pct: 33 },
	{ name: "Serviço de Notificações", events: 2040, pct: 11 },
];

const recentEvents: Array<{
	id: string;
	action: string;
	resource: string;
	actor: string;
	time: string;
	severity: Severity;
}> = [
	{
		id: "1",
		action: "DELETE",
		resource: "User · usr_10293",
		actor: "joao.silva@empresa.com",
		time: "há 4 min",
		severity: "CRITICAL",
	},
	{
		id: "2",
		action: "LOGIN_FAILED",
		resource: "Session · sess_88ff2",
		actor: "desconhecido · 203.0.113.42",
		time: "há 12 min",
		severity: "CRITICAL",
	},
	{
		id: "3",
		action: "UPDATE",
		resource: "PaymentGatewayConfig · pgc_123",
		actor: "sistema",
		time: "há 26 min",
		severity: "WARNING",
	},
	{
		id: "4",
		action: "EXPORT_DATA",
		resource: "Invoice · inv_7788",
		actor: "ana.souza@empresa.com",
		time: "há 41 min",
		severity: "WARNING",
	},
];

function Home() {
	return (
		<div className="space-y-6">
			<Card className="overflow-hidden border-border bg-card shadow-sm">
				<CardContent className="p-5 md:p-6">
					<div className="mb-3 flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-foreground">Fluxo de eventos em tempo real</p>
							<p className="font-mono text-[11px] text-muted-foreground">POST /api/v1/ingest/events · última ingestão há 8s</p>
						</div>
						<span className="hidden items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground sm:flex">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
							ao vivo
						</span>
					</div>
					<AuditPulse />
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, i) => (
					<StatCard key={stat.label} index={i} {...stat} />
				))}
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
				<Card className="border-border bg-card shadow-sm lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-sm font-semibold">Volume por aplicação</CardTitle>
						<CardDescription className="text-xs text-muted-foreground">
							Eventos recebidos nas últimas 24 horas
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{applications.map((app, i) => (
							<div key={app.name} className="space-y-1.5">
								<div className="flex items-center justify-between text-xs">
									<span className="text-foreground">{app.name}</span>
									<span className="font-mono text-muted-foreground">{app.events.toLocaleString("pt-BR")}</span>
								</div>
								<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
									<motion.div
										className="h-full rounded-full bg-primary"
										initial={{ width: 0 }}
										animate={{ width: `${app.pct}%` }}
										transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
									/>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				<Card className="border-border bg-card shadow-sm lg:col-span-3">
					<CardHeader className="flex flex-row items-center justify-between space-y-0">
						<div>
							<CardTitle className="text-sm font-semibold">Eventos recentes</CardTitle>
							<CardDescription className="text-xs text-muted-foreground">Prioridade atenção e crítico</CardDescription>
						</div>
						<Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
							<Link to="/logs">
								Ver todos <ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-1">
						{recentEvents.map((event, i) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, x: -6 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
								className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50"
							>
								<div className="flex min-w-0 items-center gap-3">
									<SeverityBadge severity={event.severity} />
									<div className="min-w-0">
										<p className="truncate text-sm text-foreground">
											<span className="font-mono text-xs text-muted-foreground">{event.action}</span> · {event.resource}
										</p>
										<p className="truncate font-mono text-[11px] text-muted-foreground">{event.actor}</p>
									</div>
								</div>
								<span className="shrink-0 font-mono text-[11px] text-muted-foreground">{event.time}</span>
							</motion.div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
