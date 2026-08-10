import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Webhook as WebhookIcon } from "lucide-react";
import { getPaginationPages } from "@/lib/pagination";
import type { PageResponse } from "@/pages/applications/types";
import type { AlertRuleResponseDTO } from "../types";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { ChannelBadge } from "./ChannelBadge";

interface AlertsTableProps {
	data?: PageResponse<AlertRuleResponseDTO>;
	isLoading: boolean;
	page: number;
	onPageChange: (page: number) => void;
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function severityStatus(severity: AlertRuleResponseDTO["minSeverity"]) {
	return severity === "CRITICAL" ? "danger" : severity === "WARNING" ? "warning" : "info";
}

function severityLabel(severity: AlertRuleResponseDTO["minSeverity"]) {
	return severity === "CRITICAL" ? "Crítico" : severity === "WARNING" ? "Atenção" : "Info";
}

function AlertsTableSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30 hover:bg-muted/30">
						<TableHead className="h-11 pl-5">
							<div className="h-3 w-20 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead>
							<div className="h-3 w-28 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead className="hidden md:table-cell">
							<div className="h-3 w-16 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead className="hidden lg:table-cell">
							<div className="h-3 w-24 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead>
							<div className="h-3 w-14 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead className="hidden pr-5 xl:table-cell">
							<div className="h-3 w-28 animate-pulse rounded bg-muted" />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{["r1", "r2", "r3", "r4", "r5"].map((rowKey) => (
						<TableRow key={rowKey} className="hover:bg-transparent">
							<TableCell className="py-4 pl-5">
								<div className="relative h-6 w-20 overflow-hidden rounded-md bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell>
								<div className="relative h-4 w-32 overflow-hidden rounded bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell className="hidden md:table-cell">
								<div className="relative h-4 w-16 overflow-hidden rounded bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell className="hidden lg:table-cell">
								<div className="relative h-6 w-24 overflow-hidden rounded-full bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell>
								<div className="relative h-6 w-16 overflow-hidden rounded-full bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell className="hidden pr-5 xl:table-cell">
								<div className="relative h-4 w-28 overflow-hidden rounded bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/5 px-6 text-center">
			<div className="mb-4 flex size-12 items-center justify-center rounded-full border bg-muted/40">
				<WebhookIcon className="size-5 text-muted-foreground" />
			</div>
			<h3 className="text-sm font-semibold">Nenhum webhook encontrado</h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">Não existem webhooks para os filtros selecionados.</p>
		</div>
	);
}

export function AlertsTable({ data, isLoading, page, onPageChange }: AlertsTableProps) {
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className="space-y-4">
				<AlertsTableSkeleton />
				<div className="flex items-center justify-between">
					<div className="h-4 w-40 animate-pulse rounded bg-muted" />
					<div className="flex gap-2">
						<div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
						<div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	if (!data || data.content.length === 0) {
		return <EmptyState />;
	}

	const currentPage = page ?? data.page ?? 0;
	const totalPages = Math.max(data.totalPages, 1);
	const firstItem = data.page * data.size + 1;
	const lastItem = Math.min((data.page + 1) * data.size, data.totalElements);
	const paginationPages = getPaginationPages(currentPage, totalPages);

	function openAlert(id: string) {
		navigate({ to: "/alerts/$id", params: { id } });
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/30 hover:bg-muted/30">
							<TableHead className="h-11 pl-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Canal
							</TableHead>
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Aplicação
							</TableHead>
							<TableHead className="hidden text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
								Eventos
							</TableHead>
							<TableHead className="hidden text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
								Severidade mínima
							</TableHead>
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Status
							</TableHead>
							<TableHead className="hidden pr-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground xl:table-cell">
								Criado em
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.content.map((alert, index) => (
							<motion.tr
								key={alert.id}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.035 }}
								tabIndex={0}
								role="link"
								aria-label={`Abrir alerta de ${alert.application.name}`}
								onClick={() => openAlert(alert.id)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										openAlert(alert.id);
									}
								}}
								className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
							>
								<TableCell className="py-4 pl-5">
									<ChannelBadge channelType={alert.channelType} />
								</TableCell>
								<TableCell>
									<span className="truncate text-sm font-medium text-foreground">{alert.application.name}</span>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<span className="text-xs text-muted-foreground">
										{alert.triggerEvents.length} evento{alert.triggerEvents.length !== 1 ? "s" : ""}
									</span>
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									<AnimatedBadge status={severityStatus(alert.minSeverity)} size="sm">
										{severityLabel(alert.minSeverity)}
									</AnimatedBadge>
								</TableCell>
								<TableCell>
									<AnimatedBadge status={alert.active ? "success" : "info"} size="sm">
										{alert.active ? "Ativo" : "Inativo"}
									</AnimatedBadge>
								</TableCell>
								<TableCell className="hidden pr-5 xl:table-cell">
									<span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
										{formatDate(alert.createdAt)}
									</span>
								</TableCell>
							</motion.tr>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-xs text-muted-foreground">
					Mostrando{" "}
					<span className="font-medium text-foreground">
						{firstItem}–{lastItem}{" "}
					</span>
					de <span className="font-medium text-foreground">{data.totalElements}</span> alertas
				</div>

				{totalPages > 1 && (
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="size-8"
							disabled={data.first}
							onClick={() => onPageChange(currentPage - 1)}
							aria-label="Página anterior"
						>
							<ChevronLeft className="size-4" />
						</Button>

						<div className="flex items-center gap-1">
							{paginationPages.map((item) =>
								item.type === "ellipsis" ? (
									<span key={item.key} className="flex size-8 items-center justify-center text-xs text-muted-foreground">
										...
									</span>
								) : (
									<Button
										key={item.key}
										variant={item.value === currentPage ? "default" : "ghost"}
										size="icon"
										className="size-8 text-xs"
										aria-current={item.value === currentPage ? "page" : undefined}
										onClick={() => onPageChange(item.value)}
									>
										{item.value + 1}
									</Button>
								),
							)}
						</div>

						<Button
							variant="outline"
							size="icon"
							className="size-8"
							disabled={data.last}
							onClick={() => onPageChange(currentPage + 1)}
							aria-label="Próxima página"
						>
							<ChevronRight className="size-4" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
