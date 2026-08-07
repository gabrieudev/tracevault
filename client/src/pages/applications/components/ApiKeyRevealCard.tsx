import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApiKeyRevealCard({ apiKey }: { apiKey: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(apiKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="space-y-3 rounded-lg border border-yellow-500/30 bg-yellow-50 p-4 dark:bg-yellow-900/20 w-100"
		>
			<div className="flex items-start gap-2">
				<ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
				<p className="text-xs leading-relaxed text-foreground">
					<strong>Copie esta chave agora.</strong> Por motivos de segurança, ela não será exibida novamente.
				</p>
			</div>

			<div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5">
				<code className="flex-1 truncate font-mono text-xs text-foreground">{apiKey}</code>
				<Button type="button" size="sm" variant="ghost" onClick={handleCopy} className="h-7 shrink-0 gap-1.5 px-2 text-xs">
					{copied ? (
						<>
							<Check className="h-3.5 w-3.5 text-primary" /> Copiado
						</>
					) : (
						<>
							<Copy className="h-3.5 w-3.5" /> Copiar
						</>
					)}
				</Button>
			</div>
		</motion.div>
	);
}
