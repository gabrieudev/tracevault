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
import { Textarea } from "@/components/ui/textarea";

import { editApplicationSchema } from "../schemas";

import { useUpdateApplication } from "../use-applications";

import type { ApplicationResponseDTO, ApplicationStatus } from "../types";

type Props = {
	application: ApplicationResponseDTO;
};

export function EditApplicationDialog({ application }: Props) {
	const [open, setOpen] = useState(false);

	const { mutateAsync, isPending, error, reset } = useUpdateApplication(application.id);

	const form = useForm({
		defaultValues: {
			name: application.name,
			description: application.description ?? "",
			status: application.status,
		},

		validators: {
			onSubmit: editApplicationSchema,
		},

		onSubmit: async ({ value }) => {
			await mutateAsync({
				name: value.name,
				description: value.description || undefined,
				status: value.status,
			});

			setOpen(false);
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				name: application.name,
				description: application.description ?? "",
				status: application.status,
			});
		} else {
			reset();
		}
	}, [open, application, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5">
					<Pencil className="h-3.5 w-3.5" />
					Editar
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						void form.handleSubmit();
					}}
					className="space-y-4"
				>
					<DialogHeader>
						<DialogTitle>Editar aplicação</DialogTitle>

						<DialogDescription>
							A API Key não é alterada aqui. Utilize a opção de rotação de chave para gerar uma nova.
						</DialogDescription>
					</DialogHeader>

					<form.Field name="name">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor="edit-name">Nome</Label>

								<Input
									id="edit-name"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>

								{field.state.meta.errors[0] && (
									<p className="text-xs text-destructive">{field.state.meta.errors[0].message}</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field name="description">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor="edit-description">Descrição</Label>

								<Textarea
									id="edit-description"
									rows={3}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>

								{field.state.meta.errors.length > 0 && (
									<p className="text-xs text-destructive">{field.state.meta.errors.join(", ")}</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field name="status">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor="edit-status">Status</Label>

								<Select value={field.state.value} onValueChange={(value) => field.handleChange(value as ApplicationStatus)}>
									<SelectTrigger id="edit-status">
										<SelectValue placeholder="Selecione um status" />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="ACTIVE">Ativa</SelectItem>

										<SelectItem value="INACTIVE">Inativa</SelectItem>
									</SelectContent>
								</Select>
								{field.state.meta.errors[0] && (
									<p className="text-xs text-destructive">{field.state.meta.errors[0].message}</p>
								)}
							</div>
						)}
					</form.Field>

					{error && <p className="font-mono text-xs text-destructive">Não foi possível salvar as alterações.</p>}

					<DialogFooter>
						<form.Subscribe
							selector={(state) => ({
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ isSubmitting }) => (
								<Button type="submit" className="gap-1.5" disabled={isSubmitting || isPending}>
									{(isSubmitting || isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
									Salvar alterações
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
