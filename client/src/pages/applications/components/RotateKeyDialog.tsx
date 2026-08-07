import { useForm } from "@tanstack/react-form";
import { KeyRound, Loader2 } from "lucide-react";
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

import { rotateKeySchema } from "../schemas";

import { useRotateApiKey } from "../use-applications";
import { ApiKeyRevealCard } from "./ApiKeyRevealCard";

type Props = {
	applicationId: string;
};

export function RotateKeyDialog({ applicationId }: Props) {
	const [open, setOpen] = useState(false);
	const [newKey, setNewKey] = useState<string | null>(null);

	const { mutateAsync, isPending, error, reset } = useRotateApiKey(applicationId);

	const form = useForm({
		defaultValues: {
			currentKey: "",
		},

		validators: {
			onSubmit: rotateKeySchema,
		},

		onSubmit: async ({ value }) => {
			const result = await mutateAsync(value.currentKey);

			setNewKey(result.plainKey);
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset();
			setNewKey(null);
			reset();
		}
	}, [open, form, reset]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/20 hover:text-destructive"
				>
					<KeyRound className="h-3.5 w-3.5" />
					Rotacionar chave
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				{newKey ? (
					<>
						<DialogHeader>
							<DialogTitle>Chave rotacionada</DialogTitle>

							<DialogDescription>A chave anterior foi invalidada imediatamente.</DialogDescription>
						</DialogHeader>

						<ApiKeyRevealCard apiKey={newKey} />

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
							<DialogTitle>Rotacionar API Key</DialogTitle>

							<DialogDescription>
								Confirme a chave atual para invalidá-la e gerar uma nova. Essa ação não poderá ser desfeita.
							</DialogDescription>
						</DialogHeader>

						<form.Field name="currentKey">
							{(field) => (
								<div className="space-y-1.5">
									<Label htmlFor="current-key">Chave atual</Label>

									<Input
										id="current-key"
										className="font-mono text-xs"
										autoComplete="off"
										placeholder="tv_live_..."
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
						{error && <p className="font-mono text-xs text-destructive">Chave inválida. Verifique e tente novamente.</p>}

						<DialogFooter>
							<form.Subscribe
								selector={(state) => ({
									isSubmitting: state.isSubmitting,
								})}
							>
								{({ isSubmitting }) => (
									<Button type="submit" variant="destructive" className="gap-1.5" disabled={isSubmitting || isPending}>
										{(isSubmitting || isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
										Confirmar rotação
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
