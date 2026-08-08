import { motion } from "framer-motion";
import { ArrowLeft, Boxes, CalendarDays, Check, Copy, Fingerprint } from "lucide-react";
import { useState } from "react";

import { Link, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { EditApplicationDialog } from "../components/EditApplicationDialog";
import { RotateKeyDialog } from "../components/RotateKeyDialog";
import { useApplication } from "../use-applications";
import { AnimatedBadge } from "@/components/motion/animated-badge";

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
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

function ApplicationSkeleton() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="h-5 w-28 animate-pulse rounded bg-muted/50" />

			<div className="overflow-hidden rounded-xl border border-border/60">
				<div className="space-y-5 p-6">
					<div className="flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="h-12 w-12 animate-pulse rounded-xl bg-muted/50" />

							<div className="space-y-2">
								<div className="h-5 w-40 animate-pulse rounded bg-muted/50" />
								<div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
							</div>
						</div>

						<div className="flex gap-2">
							<div className="h-9 w-20 animate-pulse rounded-md bg-muted/50" />
							<div className="h-9 w-28 animate-pulse rounded-md bg-muted/50" />
						</div>
					</div>

					<div className="h-px bg-border/60" />

					<div className="space-y-2">
						<div className="h-3 w-20 animate-pulse rounded bg-muted/50" />
						<div className="h-4 w-3/4 animate-pulse rounded bg-muted/50" />
					</div>
				</div>

				<div className="grid grid-cols-1 gap-3 border-t border-border/60 p-6 sm:grid-cols-3">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
						<div key={key} className="h-20 animate-pulse rounded-lg bg-muted/30" />
					))}
				</div>
			</div>
		</div>
	);
}

export function ApplicationDetailPage() {
	const { id } = useParams({
		from: "/_app/applications/$id",
	});

	const { data: application, isLoading } = useApplication(id);

	const [copied, setCopied] = useState(false);

	const handleCopyId = async () => {
		if (!application) return;

		await navigator.clipboard.writeText(application.id);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	if (isLoading) {
		return <ApplicationSkeleton />;
	}

	if (!application) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
			>
				<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
					<Boxes className="h-6 w-6 text-muted-foreground" />
				</div>

				<h2 className="text-base font-semibold">Aplicação não encontrada</h2>

				<p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
					A aplicação que você está procurando não existe ou foi removida.
				</p>

				<Button asChild variant="outline" className="mt-5">
					<Link
						search={{
							page: 0,
							search: undefined,
							status: "ALL",
						}}
						to="/applications"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para aplicações
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
					<Link
						search={{
							page: 0,
							search: undefined,
							status: "ALL",
						}}
						to="/applications"
					>
						<ArrowLeft className="h-4 w-4" />
						Aplicações
					</Link>
				</Button>
			</div>

			{/* Main card */}
			<Card className="overflow-hidden border-border/60 shadow-sm">
				{/* Header */}
				<CardHeader className="space-y-0 p-5 sm:p-6">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex min-w-0 items-start gap-4">
							{/* Application icon */}
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
								<Boxes className="h-6 w-6" />
							</div>

							<div className="min-w-0 space-y-2">
								<div className="flex flex-wrap items-center gap-2.5">
									<CardTitle className="truncate text-xl font-semibold tracking-tight">{application.name}</CardTitle>

									<AnimatedBadge status={application.status === "ACTIVE" ? "success" : "danger"} size="sm">
										{application.status === "ACTIVE" ? "Ativa" : "Inativa"}
									</AnimatedBadge>
								</div>

								<p className="text-sm text-muted-foreground">Detalhes e configurações da aplicação</p>
							</div>
						</div>

						{/* Actions */}
						<div className="flex shrink-0 items-center gap-2">
							<EditApplicationDialog application={application} />

							<RotateKeyDialog applicationId={application.id} />
						</div>
					</div>
				</CardHeader>

				{/* Description */}
				<CardContent className="space-y-6 px-5 pb-5 sm:px-6 sm:pb-6">
					<div className="h-px bg-border/60" />

					<section>
						<div className="mb-2 flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-primary" />

							<h3 className="text-sm font-medium">Descrição</h3>
						</div>

						<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
							{application.description || "Nenhuma descrição foi adicionada a esta aplicação."}
						</p>
					</section>
				</CardContent>

				{/* Metadata */}
				<div className="border-t border-border/60 bg-muted/10 p-5 sm:p-6">
					<div className="mb-4">
						<h3 className="text-sm font-semibold">Informações da aplicação</h3>

						<p className="mt-1 text-xs text-muted-foreground">Identificação e informações de criação da aplicação.</p>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div className="relative">
							<DetailItem label="ID" value={application.id} mono icon={<Fingerprint className="h-3.5 w-3.5" />} />

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
							label="Criada em"
							value={formatDateTime(application.createdAt)}
							icon={<CalendarDays className="h-3.5 w-3.5" />}
						/>

						<DetailItem
							label="Atualizada em"
							value={formatDateTime(application.updatedAt)}
							icon={<CalendarDays className="h-3.5 w-3.5" />}
						/>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
