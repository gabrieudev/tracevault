import { motion } from "framer-motion";
import {
	ArrowLeft,
	Boxes,
	Calendar,
	Check,
	Copy,
	Fingerprint,
	Globe,
	MonitorSmartphone,
	ScrollText,
	User,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DiffViewer } from "../components/DiffViewer";
import { useAuditLog } from "../use-audit-logs";
import { AnimatedBadge } from "@/components/motion/animated-badge";

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

function DetailItem({
	label,
	value,
	mono = false,
	icon,
}: {
	label: string;
	value: string;
	mono?: boolean;
	icon?: React.ReactNode;
}) {
	return (
		<div className="rounded-lg border border-border/60 bg-muted/20 p-4">
			<div className="mb-2 flex items-center gap-2 text-muted-foreground">
				{icon}
				<span className="text-xs font-medium uppercase tracking-wider">{label}</span>
			</div>

			<p className={`text-sm text-foreground ${mono ? "break-all font-mono text-xs" : ""}`}>{value}</p>
		</div>
	);
}

function LogSkeleton() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="h-5 w-32 animate-pulse rounded bg-muted/50" />
			<div className="h-52 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
			<div className="h-72 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
		</div>
	);
}

export function LogDetailPage() {
	const { id } = useParams({
		from: "/_app/logs/$id",
	});

	const { data: log, isLoading } = useAuditLog(id);

	const [copied, setCopied] = useState(false);

	const handleCopyId = async () => {
		if (!log) return;

		await navigator.clipboard.writeText(log.id);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	if (isLoading) {
		return <LogSkeleton />;
	}

	if (!log) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
			>
				<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
					<ScrollText className="h-6 w-6 text-muted-foreground" />
				</div>

				<h2 className="text-base font-semibold">Evento não encontrado</h2>

				<p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
					O log que você está procurando não existe ou foi removido.
				</p>

				<Button asChild variant="outline" className="mt-5">
					<Link to="/logs" search={{ page: 0 }}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para logs
					</Link>
				</Button>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25, ease: "easeOut" }}
			className="mx-auto w-full max-w-5xl space-y-6"
		>
			{/* Breadcrumb */}
			<div>
				<Button asChild variant="ghost" size="sm" className="-ml-2 gap-2 text-muted-foreground hover:text-foreground">
					<Link to="/logs" search={{ page: 0 }}>
						<ArrowLeft className="h-4 w-4" />
						Logs de auditoria
					</Link>
				</Button>
			</div>

			{/* Main card */}
			<Card className="overflow-hidden border-border/60 shadow-sm">
				{/* Header */}
				<CardHeader className="space-y-0 p-5 sm:p-6">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex min-w-0 items-start gap-4">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
								<ScrollText className="h-6 w-6" />
							</div>

							<div className="min-w-0 space-y-2">
								<div className="flex flex-wrap items-center gap-2.5">
									<CardTitle className="truncate font-mono text-xl font-semibold tracking-tight">{log.action}</CardTitle>

									<AnimatedBadge
										status={log.severity === "CRITICAL" ? "danger" : log.severity === "WARNING" ? "warning" : "info"}
										size="sm"
									>
										{log.severity === "CRITICAL" ? "Crítico" : log.severity === "WARNING" ? "Aviso" : "Informativo"}
									</AnimatedBadge>
								</div>

								<p className="text-sm text-muted-foreground">
									{log.resourceType} · <span className="font-mono text-xs">{log.resourceId}</span>
								</p>
							</div>
						</div>

						{/* Aplicação de origem */}
						<Link
							to="/applications/$id"
							params={{ id: log.application.id }}
							className="flex shrink-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
						>
							<Boxes className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium text-foreground">{log.application.name}</span>
						</Link>
					</div>
				</CardHeader>

				{/* Metadados do ator/contexto */}
				<CardContent className="space-y-6 px-5 pb-5 sm:px-6 sm:pb-6">
					<div className="h-px bg-border/60" />

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<DetailItem label="Ator" value={log.actorName || log.actorId} icon={<User className="h-3.5 w-3.5" />} />

						<DetailItem label="Endereço IP" value={log.actorIp || "—"} mono icon={<Globe className="h-3.5 w-3.5" />} />

						<DetailItem
							label="User-Agent"
							value={log.actorUserAgent || "—"}
							mono
							icon={<MonitorSmartphone className="h-3.5 w-3.5" />}
						/>

						<DetailItem
							label="Ocorrido em"
							value={formatDateTime(log.occurredAt)}
							icon={<Calendar className="h-3.5 w-3.5" />}
						/>

						<DetailItem
							label="Registrado em"
							value={formatDateTime(log.createdAt)}
							icon={<Calendar className="h-3.5 w-3.5" />}
						/>

						<div className="relative">
							<DetailItem label="ID do evento" value={log.id} mono icon={<Fingerprint className="h-3.5 w-3.5" />} />

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleCopyId}
								className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-foreground"
								aria-label="Copiar ID do evento"
							>
								{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
							</Button>
						</div>
					</div>
				</CardContent>

				{/* Diff — o coração da página de análise */}
				<div className="border-t border-border/60 bg-muted/10 p-5 sm:p-6">
					<div className="mb-4">
						<div className="flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-primary" />
							<h3 className="text-sm font-semibold">Alteração de estado</h3>
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							Comparação linha a linha entre o valor anterior e o valor atual do recurso.
						</p>
					</div>

					<DiffViewer oldValue={log.oldValues} newValue={log.newValues} />
				</div>

				{/* Metadata bruta (trace_id, session_id, reason, etc.) */}
				{log.metadata && Object.keys(log.metadata).length > 0 && (
					<div className="border-t border-border/60 p-5 sm:p-6">
						<div className="mb-3 flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-primary" />
							<h3 className="text-sm font-semibold">Metadados</h3>
						</div>
						<pre className="overflow-x-auto rounded-lg border bg-muted/20 p-4 font-mono text-xs text-foreground">
							{JSON.stringify(log.metadata, null, 2)}
						</pre>
					</div>
				)}
			</Card>
		</motion.div>
	);
}
