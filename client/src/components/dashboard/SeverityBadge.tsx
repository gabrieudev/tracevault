import { cn } from "@/lib/utils";

export type Severity = "INFO" | "WARNING" | "CRITICAL";

const styles: Record<Severity, string> = {
	INFO: "bg-muted text-muted-foreground",
	WARNING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	CRITICAL: "bg-destructive/20 text-destructive",
};

const labels: Record<Severity, string> = {
	INFO: "Info",
	WARNING: "Atenção",
	CRITICAL: "Crítico",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide",
				styles[severity],
			)}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-current" />
			{labels[severity]}
		</span>
	);
}
