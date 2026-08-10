import { useSearch, useNavigate } from "@tanstack/react-router";
import { AuditPulse } from "@/pages/home/components/AuditPulse";
import { StatCard } from "@/pages/home/components/StatCard";
import { useHomeSummary } from "./use-home";
import { useApplications } from "@/pages/applications/use-applications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Boxes, KeyRound, ShieldAlert } from "lucide-react";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SearchCombobox } from "@/components/SearchCombobox";

export interface HomeSearch {
	applicationId?: string;
}

export function Home() {
	const { applicationId } = useSearch({
		from: "/_app/",
	});

	const navigate = useNavigate({
		from: "/",
	});

	const {
		data: homeData,
		isLoading: isHomeLoading,
		dataUpdatedAt,
	} = useHomeSummary({
		applicationId: applicationId === "ALL" ? undefined : applicationId,
	});

	const { data: applicationsData, isLoading: isAppsLoading } = useApplications({
		size: 100,
		status: ["ACTIVE"],
	});

	function updateApplicationFilter(value?: string) {
		navigate({
			search: (prev: HomeSearch) => ({
				...prev,
				applicationId: value === "ALL" ? undefined : value,
			}),
		});
	}

	const lastUpdateDate = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
	const isInitialLoading = isHomeLoading && !homeData;

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
					<p className="text-sm text-muted-foreground">Visão geral e monitoramento de eventos de auditoria.</p>
				</div>
				<div className="flex justify-end w-full sm:w-62.5">
					<SearchCombobox
						placeholder="Filtrar por aplicação"
						value={applicationId || "ALL"}
						onChange={updateApplicationFilter}
						options={[
							{ value: "ALL", label: "Todas as aplicações" },
							...(applicationsData?.content.map((app) => ({ value: app.id, label: app.name })) || []),
						]}
					/>
				</div>
			</div>

			<Card className="overflow-hidden border-border bg-card shadow-sm transition-all duration-200">
				<CardContent className="p-5 md:p-6">
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h3 className="text-sm font-semibold text-foreground">Fluxo de eventos em tempo real</h3>
							<p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
								POST /api/v1/dashboard/summary · última ingestão{" "}
								{lastUpdateDate ? lastUpdateDate.toLocaleTimeString("pt-BR") : "aguardando..."}
							</p>
						</div>
						<div className="hidden items-center gap-2 rounded-full border border-border bg-zinc-50 px-3 py-1.5 dark:bg-zinc-900 sm:flex">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
							</span>
							<span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">ao vivo</span>
						</div>
					</div>

					{isInitialLoading ? (
						<Skeleton className="h-16 w-full rounded-lg md:h-20" />
					) : (
						<AuditPulse data={homeData?.auditPulse.data} />
					)}
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{isInitialLoading ? (
					Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-26 w-full rounded-xl" />)
				) : (
					<>
						<StatCard
							label="Eventos hoje"
							value={homeData?.stats.eventsToday.value.toLocaleString("pt-BR") || "0"}
							icon={Activity}
							delta={
								homeData?.stats.eventsToday.delta
									? {
											value: `${homeData.stats.eventsToday.delta > 0 ? "+" : ""}${homeData.stats.eventsToday.delta}%`,
											direction: homeData.stats.eventsToday.trend === "UP" ? "up" : "down",
											tone: "positive",
										}
									: undefined
							}
							index={0}
						/>
						<StatCard
							label="Aplicações ativas"
							value={`${homeData?.stats.activeApplications.active || 0}/${homeData?.stats.activeApplications.total || 0}`}
							icon={Boxes}
							index={1}
						/>
						<StatCard
							label="Alertas críticos (24h)"
							value={homeData?.stats.criticalAlerts24h.value.toString() || "0"}
							icon={ShieldAlert}
							delta={
								homeData?.stats.criticalAlerts24h.delta
									? {
											value: `${homeData.stats.criticalAlerts24h.delta > 0 ? "+" : ""}${homeData.stats.criticalAlerts24h.delta}`,
											direction: homeData.stats.criticalAlerts24h.trend === "UP" ? "up" : "down",
											tone: "negative",
										}
									: undefined
							}
							index={2}
						/>
						<StatCard
							label="Falhas de login (24h)"
							value={homeData?.stats.loginFailures24h.value.toString() || "0"}
							icon={KeyRound}
							delta={
								homeData?.stats.loginFailures24h.delta
									? {
											value: `${homeData.stats.loginFailures24h.delta > 0 ? "+" : ""}${homeData.stats.loginFailures24h.delta}%`,
											direction: homeData.stats.loginFailures24h.trend === "UP" ? "up" : "down",
											tone: homeData.stats.loginFailures24h.trend === "DOWN" ? "positive" : "negative",
										}
									: undefined
							}
							index={3}
						/>
					</>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
				<Card className="border-border bg-card shadow-sm lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-sm font-semibold">Volume por aplicação</CardTitle>
						<CardDescription className="text-xs text-muted-foreground">
							Eventos recebidos nas últimas 24 horas
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5">
						{isInitialLoading ? (
							Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<div className="flex justify-between">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-4 w-12" />
									</div>
									<Skeleton className="h-2 w-full rounded-full" />
								</div>
							))
						) : homeData?.applicationsVolume.length === 0 ? (
							<div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
								Nenhum dado encontrado para o período.
							</div>
						) : (
							homeData?.applicationsVolume.map((app, i) => (
								<div key={app.name} className="space-y-2">
									<div className="flex items-center justify-between text-xs">
										<span className="font-medium text-foreground">{app.name}</span>
										<span className="font-mono text-muted-foreground">{app.eventsCount.toLocaleString("pt-BR")}</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
										<motion.div
											className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
											initial={{ width: 0 }}
											animate={{ width: `${app.percentage}%` }}
											transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
										/>
									</div>
								</div>
							))
						)}
					</CardContent>
				</Card>

				<Card className="border-border bg-card shadow-sm lg:col-span-3">
					<CardHeader className="flex flex-row items-center justify-between space-y-0">
						<div>
							<CardTitle className="text-sm font-semibold">Eventos recentes</CardTitle>
							<CardDescription className="text-xs text-muted-foreground">
								Monitoramento de logs de atenção e críticos
							</CardDescription>
						</div>
						<Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800">
							<Link to="/logs" search={(prev) => ({ ...prev, applicationId: applicationId })}>
								Ver todos <ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-1">
						{isInitialLoading ? (
							Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="mb-1 h-13 w-full rounded-lg" />)
						) : homeData?.recentEvents.length === 0 ? (
							<div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
								Nenhum evento crítico ou de atenção recente.
							</div>
						) : (
							homeData?.recentEvents.map((event, i) => (
								<motion.div
									key={event.id}
									initial={{ opacity: 0, x: -6 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
									className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
								>
									<div className="flex min-w-0 items-center gap-3">
										<AnimatedBadge
											status={event.severity === "CRITICAL" ? "danger" : event.severity === "WARNING" ? "warning" : "info"}
											size="sm"
										>
											{event.severity === "CRITICAL" ? "Crítico" : event.severity === "WARNING" ? "Atenção" : "Informativo"}
										</AnimatedBadge>
										<div className="min-w-0">
											<p className="truncate text-sm text-foreground transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
												<span className="font-mono text-[11px] font-medium text-muted-foreground">{event.action}</span> ·{" "}
												{event.resourceType} · {event.resourceId}
											</p>
											<p className="truncate font-mono text-[11px] text-zinc-500">{event.actorName}</p>
										</div>
									</div>
									<span className="shrink-0 font-mono text-[11px] text-zinc-400">
										{formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true, locale: ptBR })}
									</span>
								</motion.div>
							))
						)}
					</CardContent>
				</Card>
			</div>
		</motion.div>
	);
}
