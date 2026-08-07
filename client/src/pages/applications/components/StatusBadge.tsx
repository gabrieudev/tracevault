import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "../types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
	const isActive = status === "ACTIVE";

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide",
				isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
			)}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-current" />
			{isActive ? "Ativa" : "Inativa"}
		</span>
	);
}
