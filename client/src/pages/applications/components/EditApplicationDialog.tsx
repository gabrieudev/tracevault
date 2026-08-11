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
			const timeoutId = setTimeout(() => {
				reset();
			}, 300);
			return () => clearTimeout(timeoutId);
		}
	}, [open, application, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5 transition-all active:scale-95">
					<Pencil className="h-3.5 w-3.5" />
					Editar
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md overflow-hidden">
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
						<DialogTitle>Editar aplicação</DialogTitle>

						<DialogDescription>
							A API Key não é alterada aqui. Utilize a opção de rotação de chave para gerar uma nova.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						<form.Field name="name">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="edit-name">Nome</Label>

									<Input
										id="edit-name"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="transition-colors focus-visible:ring-primary/50"
									/>

									{field.state.meta.errors[0] && (
										<p className="text-[0.8rem] font-medium text-destructive">{field.state.meta.errors[0].message}</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="edit-description">Descrição</Label>

									<Textarea
										id="edit-description"
										rows={3}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="resize-none transition-colors focus-visible:ring-primary/50"
									/>

									{field.state.meta.errors.length > 0 && (
										<p className="text-[0.8rem] font-medium text-destructive">{field.state.meta.errors.join(", ")}</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="status">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="edit-status">Status</Label>

									<Select value={field.state.value} onValueChange={(value) => field.handleChange(value as ApplicationStatus)}>
										<SelectTrigger id="edit-status" className="transition-colors focus-visible:ring-primary/50">
											<SelectValue placeholder="Selecione um status" />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value="ACTIVE">Ativa</SelectItem>
											<SelectItem value="INACTIVE">Inativa</SelectItem>
										</SelectContent>
									</Select>

									{field.state.meta.errors[0] && (
										<p className="text-[0.8rem] font-medium text-destructive">{field.state.meta.errors[0].message}</p>
									)}
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
									Não foi possível salvar as alterações.
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
								<Button type="submit" className="gap-2 w-full sm:w-auto transition-all" disabled={isSubmitting || isPending}>
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
