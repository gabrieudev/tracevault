import { useForm } from "@tanstack/react-form";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { editAlertSchema } from "../schemas";
import { EventsMultiSelect } from "./EventsMultiSelect";

import type { AlertRuleResponseDTO, AlertSeverity, ChannelType } from "../types";
import { useUpdateAlert } from "../use-alerts";

const DESTINATION_META: Record<ChannelType, { label: string; placeholder: string }> = {
	WEBHOOK: { label: "URL do endpoint", placeholder: "https://meuservico.com/webhooks/tracevault" },
	SLACK: { label: "Webhook URL do Slack", placeholder: "https://hooks.slack.com/services/..." },
	DISCORD: { label: "Webhook URL do Discord", placeholder: "https://discord.com/api/webhooks/..." },
	EMAIL: { label: "E-mail de destino", placeholder: "alertas@empresa.com" },
};

function buildChannelConfig(channelType: ChannelType, destination: string): Record<string, unknown> {
	switch (channelType) {
		case "EMAIL":
			return { to: destination };
		case "SLACK":
			return { webhook: destination };
		case "DISCORD":
			return { webhook: destination };
		case "WEBHOOK":
			return { url: destination };
	}
}

interface Props {
	alert: AlertRuleResponseDTO;
}

function extractDestination(channelConfig: Record<string, unknown>): string {
	const value = channelConfig.url ?? channelConfig.webhook ?? channelConfig.to;
	return typeof value === "string" ? value : JSON.stringify(channelConfig);
}

export function EditAlertDialog({ alert }: Props) {
	const [open, setOpen] = useState(false);

	const { mutateAsync, isPending, error, reset } = useUpdateAlert(alert.id);

	const form = useForm({
		defaultValues: {
			channelType: alert.channelType as ChannelType,
			destination: extractDestination(alert.channelConfig),
			minSeverity: alert.minSeverity as AlertSeverity,
			triggerEvents: alert.triggerEvents,
			messageTemplate: alert.messageTemplate ?? "",
			active: alert.active,
		},

		validators: {
			onSubmit: editAlertSchema,
		},

		onSubmit: async ({ value }) => {
			await mutateAsync({
				channelType: value.channelType,
				channelConfig: buildChannelConfig(value.channelType, value.destination),
				minSeverity: value.minSeverity,
				triggerEvents: value.triggerEvents,
				messageTemplate: value.messageTemplate || undefined,
				active: value.active,
			});

			setOpen(false);
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset();
			reset();
		}
	}, [open, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-1.5">
					<Pencil className="h-4 w-4" />
					Editar
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						void form.handleSubmit();
					}}
					className="space-y-4"
				>
					<DialogHeader>
						<DialogTitle>Editar alerta</DialogTitle>

						<DialogDescription>
							Dispare alertas automáticos sempre que eventos críticos acontecerem em uma aplicação.
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-2 gap-4">
						<form.Field name="channelType">
							{(field) => (
								<div className="space-y-1.5">
									<Label>Canal</Label>
									<Select
										value={field.state.value}
										onValueChange={(v) => {
											field.handleChange(v as ChannelType);
											form.setFieldValue("destination", "");
										}}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="WEBHOOK">Webhook</SelectItem>
											<SelectItem value="SLACK">Slack</SelectItem>
											<SelectItem value="DISCORD">Discord</SelectItem>
											<SelectItem value="EMAIL">E-mail</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</form.Field>

						<form.Field name="minSeverity">
							{(field) => (
								<div className="space-y-1.5">
									<Label>Severidade mínima</Label>
									<Select
										value={field.state.value}
										onValueChange={(v) => field.handleChange(v as "INFO" | "WARNING" | "CRITICAL")}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="INFO">Info</SelectItem>
											<SelectItem value="WARNING">Atenção</SelectItem>
											<SelectItem value="CRITICAL">Crítico</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</form.Field>
					</div>

					<form.Subscribe selector={(state) => state.values.channelType}>
						{(channelType) => (
							<form.Field name="destination">
								{(field) => (
									<div className="space-y-1.5">
										<Label htmlFor="destination">{DESTINATION_META[channelType].label}</Label>
										<Input
											id="destination"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder={DESTINATION_META[channelType].placeholder}
											className="font-mono text-xs"
										/>
										{field.state.meta.errors[0] && (
											<p className="text-xs text-destructive">{field.state.meta.errors[0].message}</p>
										)}
									</div>
								)}
							</form.Field>
						)}
					</form.Subscribe>

					<form.Field name="triggerEvents">
						{(field) => (
							<div className="space-y-1.5">
								<Label>Eventos de disparo</Label>
								<EventsMultiSelect value={field.state.value} onChange={field.handleChange} />
								{field.state.meta.errors[0] && <p className="text-xs text-destructive">{field.state.meta.errors[0].message}</p>}
							</div>
						)}
					</form.Field>

					<form.Field name="active">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor="active">Status</Label>
								<div className="flex items-center gap-2">
									<Switch id="active" checked={field.state.value} onCheckedChange={field.handleChange} />
									<span className="text-sm text-muted-foreground">{field.state.value ? "Ativo" : "Inativo"}</span>
								</div>
							</div>
						)}
					</form.Field>

					<form.Field name="messageTemplate">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor="messageTemplate">Mensagem (opcional)</Label>
								<Textarea
									id="messageTemplate"
									rows={2}
									placeholder="Ex: Novo evento crítico: {action} em {resourceType}"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>

					{error && (
						<p className="font-mono text-xs text-destructive">
							Não foi possível editar o alerta. Verifique os dados e tente novamente.
						</p>
					)}

					<DialogFooter>
						<form.Subscribe
							selector={(state) => ({
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ isSubmitting }) => (
								<Button type="submit" disabled={isSubmitting || isPending} className="gap-1.5">
									{(isSubmitting || isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
									Editar alerta
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
