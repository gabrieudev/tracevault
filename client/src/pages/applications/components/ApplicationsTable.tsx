import { AnimatedBadge } from "@/components/motion/animated-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import type { ApplicationResponseDTO, PageResponse } from "../types";

interface ApplicationsTableProps {
	data?: PageResponse<ApplicationResponseDTO>;
	isLoading: boolean;
	page: number | undefined;
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

function ApplicationsTableSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30 hover:bg-muted/30">
						<TableHead className="h-11 pl-5">
							<div className="h-3 w-16 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead className="hidden md:table-cell">
							<div className="h-3 w-20 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead>
							<div className="h-3 w-14 animate-pulse rounded bg-muted" />
						</TableHead>
						<TableHead className="hidden pr-5 lg:table-cell">
							<div className="h-3 w-16 animate-pulse rounded bg-muted" />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{[
						"skeleton-row-1",
						"skeleton-row-2",
						"skeleton-row-3",
						"skeleton-row-4",
						"skeleton-row-5",
						"skeleton-row-6",
						"skeleton-row-7",
					].map((rowKey) => (
						<TableRow key={rowKey} className="hover:bg-transparent">
							<TableCell className="py-4 pl-5">
								<div className="flex items-center gap-3">
									<div className="relative size-8 shrink-0 overflow-hidden rounded-md bg-muted">
										<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
									</div>
									<div className="min-w-0 space-y-2">
										<div className="relative h-4 w-28 overflow-hidden rounded bg-muted">
											<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
										</div>
										<div className="relative h-2.5 w-20 overflow-hidden rounded bg-muted">
											<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell className="hidden md:table-cell">
								<div className="relative h-4 w-[70%] max-w-64 overflow-hidden rounded bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell>
								<div className="relative h-6 w-20 overflow-hidden rounded-full bg-muted">
									<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-background/50 to-transparent" />
								</div>
							</TableCell>
							<TableCell className="hidden pr-5 lg:table-cell">
								<div className="relative h-4 w-32 overflow-hidden rounded bg-muted">
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
				<Inbox className="size-5 text-muted-foreground" />
			</div>
			<h3 className="text-sm font-semibold"> Nenhuma aplicação encontrada </h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">Não existem aplicações para os filtros selecionados.</p>
		</div>
	);
}

function getPaginationPages(
	currentPage: number,
	totalPages: number,
): Array<{ type: "page"; value: number; key: string } | { type: "ellipsis"; key: string }> {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, index) => ({ type: "page", value: index, key: `page-${index}` }));
	}
	if (currentPage <= 2) {
		return [
			{ type: "page", value: 0, key: "page-0" },
			{ type: "page", value: 1, key: "page-1" },
			{ type: "page", value: 2, key: "page-2" },
			{ type: "ellipsis", key: "ellipsis-end" },
			{ type: "page", value: totalPages - 1, key: `page-${totalPages - 1}` },
		];
	}
	if (currentPage >= totalPages - 3) {
		return [
			{ type: "page", value: 0, key: "page-0" },
			{ type: "ellipsis", key: "ellipsis-start" },
			{ type: "page", value: totalPages - 3, key: `page-${totalPages - 3}` },
			{ type: "page", value: totalPages - 2, key: `page-${totalPages - 2}` },
			{ type: "page", value: totalPages - 1, key: `page-${totalPages - 1}` },
		];
	}
	return [
		{ type: "page", value: 0, key: "page-0" },
		{ type: "ellipsis", key: "ellipsis-start" },
		{ type: "page", value: currentPage, key: `page-${currentPage}` },
		{ type: "ellipsis", key: "ellipsis-end" },
		{ type: "page", value: totalPages - 1, key: `page-${totalPages - 1}` },
	];
}

export function ApplicationsTable({ data, isLoading, page, onPageChange }: ApplicationsTableProps) {
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className="space-y-4">
				<ApplicationsTableSkeleton />
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

	function openApplication(application: ApplicationResponseDTO) {
		navigate({ to: "/applications/$id", params: { id: application.id } });
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/30 hover:bg-muted/30">
							<TableHead className="h-11 pl-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Nome
							</TableHead>
							<TableHead className="hidden h-11 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
								Descrição
							</TableHead>
							<TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Status
							</TableHead>
							<TableHead className="hidden h-11 pr-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
								Criada em
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.content.map((application: ApplicationResponseDTO, index: number) => (
							<motion.tr
								key={application.id}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.035 }}
								tabIndex={0}
								role="link"
								aria-label={`Abrir aplicação ${application.name}`}
								onClick={() => openApplication(application)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										openApplication(application);
									}
								}}
								className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
							>
								<TableCell className="relative py-4 pl-5">
									<div className="flex items-center gap-3">
										<div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
											<Building2 className="w-4 h-4" />
										</div>
										<div className="min-w-0">
											<div className="flex items-center gap-1.5">
												<span className="truncate text-sm font-medium text-foreground"> {application.name} </span>
												<ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
											</div>
											<span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/60"> {application.id} </span>
										</div>
									</div>
								</TableCell>
								<TableCell className="hidden max-w-[320px] md:table-cell">
									<span title={application.description || undefined} className="block truncate text-sm text-muted-foreground">
										{application.description || "Sem descrição"}
									</span>
								</TableCell>
								<TableCell>
									<AnimatedBadge status={application.status === "ACTIVE" ? "success" : "danger"} size="sm">
										{application.status === "ACTIVE" ? "Ativa" : "Inativa"}
									</AnimatedBadge>
								</TableCell>
								<TableCell className="hidden pr-5 lg:table-cell">
									<span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
										{formatDate(application.createdAt)}
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
					de <span className="font-medium text-foreground"> {data.totalElements} </span> aplicações
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
							{paginationPages.map((item) => {
								if (item.type === "ellipsis") {
									return (
										<span key={item.key} className="flex size-8 items-center justify-center text-xs text-muted-foreground">
											...
										</span>
									);
								}

								const isActive = item.value === currentPage;

								return (
									<Button
										key={item.key}
										variant={isActive ? "default" : "ghost"}
										size="icon"
										className="size-8 text-xs"
										aria-current={isActive ? "page" : undefined}
										onClick={() => onPageChange(item.value)}
									>
										{item.value + 1}
									</Button>
								);
							})}
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
