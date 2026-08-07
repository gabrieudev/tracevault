import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
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

export function ApplicationsTable({ data, isLoading, page, onPageChange }: ApplicationsTableProps) {
	if (isLoading) {
		return (
			<div className="space-y-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-14 animate-pulse rounded-md bg-muted/30" />
				))}
			</div>
		);
	}

	if (!data || data.content.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
				<Inbox className="h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">Nenhuma aplicação encontrada.</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="overflow-hidden rounded-lg border border-border">
				<table className="w-full text-left text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/20">
							<th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Nome</th>
							<th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">
								Descrição
							</th>
							<th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
							<th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">
								Criada em
							</th>
						</tr>
					</thead>
					<tbody>
						{data.content.map((app, i) => (
							<motion.tr
								key={app.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.25, delay: i * 0.04 }}
								className="border-b border-border last:border-0 hover:bg-muted/10"
							>
								<td className="px-4 py-3">
									<Link
										to="/applications/$id"
										params={{ id: app.id }}
										className="text-sm font-medium text-foreground hover:text-primary"
									>
										{app.name}
									</Link>
								</td>
								<td className="hidden max-w-xs truncate px-4 py-3 text-xs text-muted-foreground md:table-cell">
									{app.description || "—"}
								</td>
								<td className="px-4 py-3">
									<StatusBadge status={app.status} />
								</td>
								<td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground lg:table-cell">
									{formatDate(app.createdAt)}
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between">
				<p className="font-mono text-[11px] text-muted-foreground">
					{data.totalElements} aplicações · página {data.page + 1} de {Math.max(data.totalPages, 1)}
				</p>
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						disabled={data.first}
						onClick={() => onPageChange((page ?? 0) - 1)}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						disabled={data.last}
						onClick={() => onPageChange((page ?? 0) + 1)}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
