import { EditApplicationDialog } from "../components/EditApplicationDialog";
import { RotateKeyDialog } from "../components/RotateKeyDialog";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "../use-applications";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Boxes } from "lucide-react";

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function ApplicationDetailPage() {
	const { id } = useParams({
		from: "/_app/applications/$id",
	});
	const { data: application, isLoading } = useApplication(id);

	if (isLoading) {
		return (
			<div className="space-y-3">
				<div className="h-8 w-48 animate-pulse rounded-md bg-muted/30" />
				<div className="h-40 animate-pulse rounded-lg bg-muted/30" />
			</div>
		);
	}

	if (!application) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
				<Boxes className="h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">Aplicação não encontrada.</p>
				<Button asChild variant="outline" size="sm">
					<Link
						search={{
							page: 0,
							search: undefined,
							status: "ALL",
						}}
						to="/applications"
					>
						Voltar para Aplicações
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			<Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
				<Link
					search={{
						page: 0,
						search: undefined,
						status: "ALL",
					}}
					to="/applications"
				>
					<ArrowLeft className="h-3.5 w-3.5" /> Aplicações
				</Link>
			</Button>

			<Card className="border-border bg-card shadow-sm">
				<CardHeader className="flex flex-col items-start justify-between gap-4 space-y-0 sm:flex-row">
					<div className="space-y-1.5">
						<div className="flex items-center gap-2.5">
							<span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/20 text-primary">
								<Boxes className="h-4.5 w-4.5" />
							</span>
							<CardTitle className="text-lg text-foreground">{application.name}</CardTitle>
						</div>
						<StatusBadge status={application.status} />
					</div>
					<div className="flex items-center gap-2">
						<EditApplicationDialog application={application} />
						<RotateKeyDialog applicationId={application.id} />
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Descrição</p>
						<p className="mt-1 text-sm text-foreground">{application.description || "Sem descrição."}</p>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div>
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">ID</p>
							<p className="mt-1 truncate font-mono text-xs text-foreground">{application.id}</p>
						</div>
						<div>
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Criada em</p>
							<p className="mt-1 font-mono text-xs text-foreground">{formatDateTime(application.createdAt)}</p>
						</div>
						<div>
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Atualizada em</p>
							<p className="mt-1 font-mono text-xs text-foreground">{formatDateTime(application.updatedAt)}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
