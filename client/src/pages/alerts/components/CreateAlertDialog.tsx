import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchCombobox } from "@/components/SearchCombobox";

import { createAlertSchema } from "../schemas";
import { useCreateAlert } from "../use-alerts";
import { useApplicationsForFilter } from "../use-applications-for-filter";
import { EventsMultiSelect } from "./EventsMultiSelect";

import type { AlertSeverity, ChannelType } from "../types";

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

export function CreateAlertDialog() {
	const [open, setOpen] = useState(false);

	const { data: applicationsData } = useApplicationsForFilter();
	const { mutateAsync, isPending, error, reset } = useCreateAlert();

	const form = useForm({
		defaultValues: {
			applicationId: "",
			channelType: "WEBHOOK" as ChannelType,
			destination: "",
			minSeverity: "WARNING" as AlertSeverity,
			triggerEvents: [] as string[],
			messageTemplate: "",
		},

		validators: {
			onSubmit: createAlertSchema,
		},

		onSubmit: async ({ value }) => {
			await mutateAsync({
				applicationId: value.applicationId,
				channelType: value.channelType,
				channelConfig: buildChannelConfig(value.channelType, value.destination),
				minSeverity: value.minSeverity,
				triggerEvents: value.triggerEvents,
				messageTemplate: value.messageTemplate || undefined,
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
				<Button className="gap-1.5">
					<Plus className="h-4 w-4" />
					Novo alerta
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
						<DialogTitle>Novo alerta</DialogTitle>

						<DialogDescription>
							Dispare alertas automáticos sempre que eventos críticos acontecerem em uma aplicação.
						</DialogDescription>
					</DialogHeader>

					<form.Field name="applicationId">
						{(field) => (
							<div className="space-y-1.5">
								<Label>Aplicação</Label>
								<SearchCombobox
									className="w-full"
									value={field.state.value}
									onChange={(value) => field.handleChange(value ?? "")}
									placeholder="Selecione a aplicação"
									emptyText="Nenhuma aplicação encontrada."
									options={(applicationsData?.content ?? []).map((app) => ({
										label: app.name,
										value: app.id,
									}))}
								/>

								{field.state.meta.errors[0] && <p className="text-xs text-destructive">{field.state.meta.errors[0].message}</p>}
							</div>
						)}
					</form.Field>

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
							Não foi possível criar o alerta. Verifique os dados e tente novamente.
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
									Criar alerta
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
