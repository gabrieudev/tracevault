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

import { createApplicationSchema } from "../schemas";

import { useCreateApplication } from "../use-applications";
import { ApiKeyRevealCard } from "./ApiKeyRevealCard";

export function CreateApplicationDialog() {
	const [open, setOpen] = useState(false);
	const [createdKey, setCreatedKey] = useState<string | null>(null);

	const { mutateAsync, isPending, error, reset } = useCreateApplication();

	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
		},

		validators: {
			onSubmit: createApplicationSchema,
		},

		onSubmit: async ({ value }) => {
			const result = await mutateAsync({
				name: value.name,
				description: value.description || undefined,
			});

			setCreatedKey(result.plainKey);
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset();
			setCreatedKey(null);
			reset();
		}
	}, [open, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-1.5">
					<Plus className="h-4 w-4" />
					Nova aplicação
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				{createdKey ? (
					<>
						<DialogHeader>
							<DialogTitle>Aplicação criada com sucesso</DialogTitle>

							<DialogDescription>Configure a chave abaixo nas variáveis de ambiente do sistema de origem.</DialogDescription>
						</DialogHeader>

						<ApiKeyRevealCard apiKey={createdKey} />

						<DialogFooter>
							<Button onClick={() => setOpen(false)}>Concluir</Button>
						</DialogFooter>
					</>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit();
						}}
						className="space-y-4"
					>
						<DialogHeader>
							<DialogTitle>Nova aplicação</DialogTitle>

							<DialogDescription>Registre um sistema autorizado a enviar logs de auditoria.</DialogDescription>
						</DialogHeader>

						<form.Field name="name">
							{(field) => (
								<div className="space-y-1.5">
									<Label htmlFor="name">Nome</Label>

									<Input
										id="name"
										placeholder="Ex: Portal do Cliente"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									
								</div>
							)}
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<div className="space-y-1.5">
									<Label htmlFor="description">Descrição</Label>

									<Textarea
										id="description"
										rows={3}
										placeholder="Breve descrição do sistema (opcional)"
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
						{error && (
							<p className="font-mono text-xs text-destructive">
								Não foi possível criar a aplicação. Verifique os dados e tente novamente.
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
										Criar aplicação
									</Button>
								)}
							</form.Subscribe>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
