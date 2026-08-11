import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, KeyRound, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ApiKeyRevealCardProps {
	apiKey: string;
}

export function ApiKeyRevealCard({ apiKey }: ApiKeyRevealCardProps) {
	const [copied, setCopied] = useState(false);
	const [visible, setVisible] = useState(true);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(apiKey);
			setCopied(true);

			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch {
			setCopied(false);
		}
	}

	const displayedKey = visible
		? apiKey
		: `${apiKey.slice(0, 8)}${"•".repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}`;

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="w-full max-w-2xl overflow-hidden rounded-xl border border-amber-500/30 bg-amber-50/70 shadow-sm dark:border-amber-500/20 dark:bg-amber-950/20"
		>
			<div className="flex items-start gap-3 border-b border-amber-500/20 px-4 py-4 sm:px-5">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
					<ShieldAlert className="size-5" />
				</div>

				<div className="min-w-0 flex-1">
					<h3 className="text-sm font-semibold text-foreground">Chave de API gerada</h3>

					<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
						Esta é a única vez que sua chave será exibida.
						<span className="font-medium text-foreground"> Copie e armazene-a em um local seguro.</span>
					</p>
				</div>
			</div>

			<div className="space-y-3 p-4 sm:p-5">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<KeyRound className="size-4 text-muted-foreground" />

						<span className="text-xs font-medium text-muted-foreground">Sua API Key</span>
					</div>

					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setVisible((current) => !current)}
						className="h-8 gap-1.5 px-2.5 text-xs"
						aria-label={visible ? "Ocultar API key" : "Mostrar API key"}
					>
						{visible ? (
							<>
								<EyeOff className="size-3.5" />
								Ocultar
							</>
						) : (
							<>
								<Eye className="size-3.5" />
								Mostrar
							</>
						)}
					</Button>
				</div>

				<div className="group relative rounded-lg border border-border bg-background p-3 shadow-xs sm:p-4">
					<div className="min-h-12 pr-1">
						<code
							className={[
								"block select-all break-all font-mono text-xs leading-6 text-foreground",
								"sm:text-sm sm:leading-7",
							].join(" ")}
						>
							{displayedKey}
						</code>
					</div>
				</div>

				<Button type="button" onClick={handleCopy} className="w-full gap-2" variant={copied ? "secondary" : "default"}>
					{copied ? (
						<>
							<Check className="size-4 text-emerald-500" />
							Chave copiada
						</>
					) : (
						<>
							<Copy className="size-4" />
							Copiar API Key
						</>
					)}
				</Button>

				<p className="text-center text-[11px] leading-relaxed text-muted-foreground">
					Não compartilhe esta chave. Ela concede acesso à sua aplicação.
				</p>
			</div>
		</motion.div>
	);
}
