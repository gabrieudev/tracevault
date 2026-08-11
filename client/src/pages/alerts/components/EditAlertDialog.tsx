import { useForm } from "@tanstack/react-form";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
		if (open) {
			form.reset({
				channelType: alert.channelType as ChannelType,
				destination: extractDestination(alert.channelConfig),
				minSeverity: alert.minSeverity as AlertSeverity,
				triggerEvents: alert.triggerEvents,
				messageTemplate: alert.messageTemplate ?? "",
				active: alert.active,
			});
		} else {
			const timeoutId = setTimeout(() => {
				form.reset();
				reset();
			}, 300);
			return () => clearTimeout(timeoutId);
		}
	}, [open, alert, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5 transition-all active:scale-95">
					<Pencil className="h-3.5 w-3.5" />
					Editar
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg overflow-hidden">
				<motion.form
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					onSubmit={(e) => {
						e.preventDefault();
						void form.handleSubmit();
					}}
					className="space-y-6"
				>
					<DialogHeader>
						<DialogTitle>Editar alerta</DialogTitle>

						<DialogDescription>
							Dispare alertas automáticos sempre que eventos críticos acontecerem em uma aplicação.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<form.Field name="channelType">
								{(field) => (
									<div className="space-y-2">
										<Label>Canal</Label>
										<Select
											value={field.state.value}
											onValueChange={(v) => {
												field.handleChange(v as ChannelType);
												form.setFieldValue("destination", "");
											}}
										>
											<SelectTrigger className="transition-colors focus-visible:ring-primary/50">
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
									<div className="space-y-2">
										<Label>Severidade mínima</Label>
										<Select
											value={field.state.value}
											onValueChange={(v) => field.handleChange(v as "INFO" | "WARNING" | "CRITICAL")}
										>
											<SelectTrigger className="transition-colors focus-visible:ring-primary/50">
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
										<div className="space-y-2">
											<Label htmlFor="destination">{DESTINATION_META[channelType].label}</Label>
											<Input
												id="destination"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder={DESTINATION_META[channelType].placeholder}
												className="font-mono text-xs transition-colors focus-visible:ring-primary/50"
											/>
											{field.state.meta.errors[0] && (
												<p className="text-[0.8rem] font-medium text-destructive">{field.state.meta.errors[0].message}</p>
											)}
										</div>
									)}
								</form.Field>
							)}
						</form.Subscribe>

						<form.Field name="triggerEvents">
							{(field) => (
								<div className="space-y-2">
									<Label>Eventos de disparo</Label>
									<EventsMultiSelect value={field.state.value} onChange={field.handleChange} />
									{field.state.meta.errors[0] && (
										<p className="text-[0.8rem] font-medium text-destructive">{field.state.meta.errors[0].message}</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="active">
							{(field) => (
								<div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-card">
									<div className="space-y-0.5">
										<Label htmlFor="active" className="text-sm font-medium cursor-pointer">
											Status do alerta
										</Label>
										<p className="text-xs text-muted-foreground">
											{field.state.value
												? "O alerta está ativo e enviará notificações."
												: "O alerta está temporariamente pausado."}
										</p>
									</div>
									<Switch id="active" checked={field.state.value} onCheckedChange={field.handleChange} />
								</div>
							)}
						</form.Field>

						<form.Field name="messageTemplate">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="messageTemplate">Mensagem (opcional)</Label>
									<Textarea
										id="messageTemplate"
										rows={2}
										placeholder="Ex: Novo evento crítico: {action} em {resourceType}"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="resize-none transition-colors focus-visible:ring-primary/50"
									/>
								</div>
							)}
						</form.Field>

						<AnimatePresence>
							{error && (
								<motion.p
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="font-mono text-xs text-destructive bg-destructive/10 p-2 rounded-md overflow-hidden"
								>
									Não foi possível editar o alerta. Verifique os dados e tente novamente.
								</motion.p>
							)}
						</AnimatePresence>
					</div>

					<DialogFooter>
						<form.Subscribe
							selector={(state) => ({
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ isSubmitting }) => (
								<Button type="submit" disabled={isSubmitting || isPending} className="gap-2 w-full sm:w-auto transition-all">
									{(isSubmitting || isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
									Salvar alterações
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</motion.form>
			</DialogContent>
		</Dialog>
	);
}
