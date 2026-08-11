import { useForm } from "@tanstack/react-form";
import { Loader2, Plus, CheckCircle2 } from "lucide-react";
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
			const timeoutId = setTimeout(() => {
				form.reset();
				setCreatedKey(null);
				reset();
			}, 300);
			return () => clearTimeout(timeoutId);
		}
	}, [open, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-1.5 transition-all active:scale-95">
					<Plus className="h-4 w-4" />
					Nova aplicação
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md overflow-hidden">
				<AnimatePresence mode="wait">
					{createdKey ? (
						<motion.div
							key="success-view"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="space-y-6"
						>
							<DialogHeader className="flex flex-col items-center space-y-3 text-center sm:text-center pt-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
									<CheckCircle2 className="h-6 w-6 text-primary" />
								</div>
								<div className="space-y-1">
									<DialogTitle className="text-xl">Aplicação criada com sucesso</DialogTitle>
									<DialogDescription>Configure a chave abaixo nas variáveis de ambiente do sistema de origem.</DialogDescription>
								</div>
							</DialogHeader>

							<div className="px-1">
								<ApiKeyRevealCard apiKey={createdKey} />
							</div>

							<DialogFooter className="sm:justify-center">
								<Button className="w-full sm:w-auto" onClick={() => setOpen(false)}>
									Concluir
								</Button>
							</DialogFooter>
						</motion.div>
					) : (
						<motion.form
							key="form-view"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							onSubmit={(e) => {
								e.preventDefault();
								void form.handleSubmit();
							}}
							className="space-y-6"
						>
							<DialogHeader>
								<DialogTitle>Nova aplicação</DialogTitle>
								<DialogDescription>Registre um sistema autorizado a enviar logs de auditoria.</DialogDescription>
							</DialogHeader>

							<div className="space-y-4 py-2">
								<form.Field name="name">
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor="name">Nome</Label>
											<Input
												id="name"
												placeholder="Ex: Portal do Cliente"
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
											<Label htmlFor="description">Descrição</Label>
											<Textarea
												id="description"
												rows={3}
												placeholder="Breve descrição do sistema (opcional)"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className="resize-none transition-colors focus-visible:ring-primary/50"
											/>
											{field.state.meta.errors[0] && (
												<p className="text-[0.8rem] font-medium text-destructive">{field.state.meta.errors[0].message}</p>
											)}
										</div>
									)}
								</form.Field>

								{error && (
									<motion.p
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										className="font-mono text-xs text-destructive bg-destructive/10 p-2 rounded-md"
									>
										Não foi possível criar a aplicação. Verifique os dados e tente novamente.
									</motion.p>
								)}
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
											Criar aplicação
										</Button>
									)}
								</form.Subscribe>
							</DialogFooter>
						</motion.form>
					)}
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
