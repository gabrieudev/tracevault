import { motion } from "framer-motion";
import { ArrowLeft, Boxes, Calendar, Check, Copy, Fingerprint, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBadge } from "@/components/motion/animated-badge";

import { ChannelBadge } from "../components/ChannelBadge";
import { useAlert } from "../use-alerts";
import type { AlertRuleResponseDTO } from "../types";
import { EditAlertDialog } from "../components/EditAlertDialog";

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function severityLabel(severity: AlertRuleResponseDTO["minSeverity"]) {
	return severity === "CRITICAL" ? "Crítico" : severity === "WARNING" ? "Atenção" : "Info";
}

function extractDestination(channelConfig: Record<string, unknown>): string {
	const value = channelConfig.url ?? channelConfig.webhook ?? channelConfig.to;
	return typeof value === "string" ? value : JSON.stringify(channelConfig);
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

function WebhookSkeleton() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="h-5 w-28 animate-pulse rounded bg-muted/50" />
			<div className="h-52 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
			<div className="h-48 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
		</div>
	);
}

export function AlertDetailPage() {
	const { id } = useParams({
		from: "/_app/alerts/$id",
	});

	const { data: alert, isLoading } = useAlert(id);

	const [copied, setCopied] = useState(false);

	const handleCopyId = async () => {
		if (!alert) return;

		await navigator.clipboard.writeText(alert.id);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	if (isLoading) {
		return <WebhookSkeleton />;
	}

	if (!alert) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
			>
				<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
					<MessageSquareText className="h-6 w-6 text-muted-foreground" />
				</div>

				<h2 className="text-base font-semibold">Webhook não encontrado</h2>

				<p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
					O webhook que você está procurando não existe ou foi removido.
				</p>

				<Button asChild variant="outline" className="mt-5">
					<Link to="/alerts" search={{ page: 0 }}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para alertas
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
			<div>
				<Button asChild variant="ghost" size="sm" className="-ml-2 gap-2 text-muted-foreground hover:text-foreground">
					<Link to="/alerts" search={{ page: 0 }}>
						<ArrowLeft className="h-4 w-4" />
						Alertas
					</Link>
				</Button>
			</div>

			<Card className="overflow-hidden border-border/60 shadow-sm">
				<CardHeader className="space-y-0 p-5 sm:p-6">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex min-w-0 items-start gap-4">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
								<MessageSquareText className="h-6 w-6" />
							</div>

							<div className="min-w-0 space-y-2">
								<div className="flex flex-wrap items-center gap-2.5">
									<CardTitle className="text-xl font-semibold tracking-tight">Alerta de auditoria</CardTitle>

									<AnimatedBadge status={alert.active ? "success" : "info"} size="sm">
										{alert.active ? "Ativo" : "Inativo"}
									</AnimatedBadge>
								</div>

								<ChannelBadge channelType={alert.channelType} />
							</div>
						</div>

						<div className="flex items-end gap-2">
							<EditAlertDialog alert={alert} />

							<Link
								to="/applications/$id"
								params={{ id: alert.application.id }}
								className="flex shrink-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
							>
								<Boxes className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium text-foreground">{alert.application.name}</span>
							</Link>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6 px-5 pb-5 sm:px-6 sm:pb-6">
					<div className="h-px bg-border/60" />

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<DetailItem label="Destino" value={extractDestination(alert.channelConfig)} mono />
						<DetailItem label="Severidade mínima" value={severityLabel(alert.minSeverity)} />
					</div>

					{alert.messageTemplate && (
						<div>
							<p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Modelo de mensagem</p>
							<p className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-foreground">
								{alert.messageTemplate}
							</p>
						</div>
					)}

					<div>
						<p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Eventos de disparo ({alert.triggerEvents.length})
						</p>
						<div className="flex flex-wrap gap-1.5">
							{alert.triggerEvents.map((event) => (
								<span key={event} className="rounded-md border bg-muted/40 px-2 py-1 font-mono text-[11px] text-foreground">
									{event}
								</span>
							))}
						</div>
					</div>
				</CardContent>

				<div className="border-t border-border/60 bg-muted/10 p-5 sm:p-6">
					<div className="mb-4">
						<h3 className="text-sm font-semibold">Informações do alerta</h3>
						<p className="mt-1 text-xs text-muted-foreground">Identificação e datas de criação/atualização.</p>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div className="relative">
							<DetailItem label="ID" value={alert.id} mono icon={<Fingerprint className="h-3.5 w-3.5" />} />

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleCopyId}
								className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-foreground"
								aria-label="Copiar ID"
							>
								{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
							</Button>
						</div>

						<DetailItem
							label="Criado em"
							value={formatDateTime(alert.createdAt)}
							icon={<Calendar className="h-3.5 w-3.5" />}
						/>

						<DetailItem
							label="Atualizado em"
							value={formatDateTime(alert.updatedAt)}
							icon={<Calendar className="h-3.5 w-3.5" />}
						/>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
