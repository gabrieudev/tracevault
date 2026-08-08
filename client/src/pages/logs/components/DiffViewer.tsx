import { diffJson } from "@/lib/json-diff";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface DiffViewerProps {
	oldValue?: Record<string, unknown>;
	newValue?: Record<string, unknown>;
}

export function DiffViewer({ oldValue, newValue }: DiffViewerProps) {
	const lines = useMemo(() => diffJson(oldValue, newValue), [oldValue, newValue]);

	const additions = lines.filter((line) => line.type === "added").length;
	const removals = lines.filter((line) => line.type === "removed").length;

	if (oldValue === undefined && newValue === undefined) {
		return (
			<div className="flex items-center justify-center rounded-lg border border-dashed py-10 text-sm text-muted-foreground">
				Este evento não registrou alteração de estado.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border">
			<div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
				<span className="text-xs font-medium text-muted-foreground">Diferenças</span>
				<div className="flex items-center gap-3 font-mono text-[11px] font-medium">
					<span className="text-emerald-600 dark:text-emerald-400">+{additions}</span>
					<span className="text-red-600 dark:text-red-400">-{removals}</span>
				</div>
			</div>

			<div className="max-h-105 overflow-auto bg-card">
				<table className="w-full border-collapse font-mono text-xs leading-relaxed">
					<tbody>
						{lines.map((line) => (
							<tr
								key={`${line.type}-${line.oldLineNumber ?? "old-none"}-${line.newLineNumber ?? "new-none"}-${line.content}`}
								className={cn(
									line.type === "added" && "bg-emerald-50 dark:bg-emerald-950/30",
									line.type === "removed" && "bg-red-50 dark:bg-red-950/30",
								)}
							>
								<td className="w-10 select-none border-r px-2 py-0.5 text-right text-muted-foreground/50">
									{line.oldLineNumber ?? ""}
								</td>
								<td className="w-10 select-none border-r px-2 py-0.5 text-right text-muted-foreground/50">
									{line.newLineNumber ?? ""}
								</td>
								<td
									className={cn(
										"w-5 select-none px-1.5 py-0.5 text-center font-semibold",
										line.type === "added" && "text-emerald-600 dark:text-emerald-400",
										line.type === "removed" && "text-red-600 dark:text-red-400",
										line.type === "unchanged" && "text-transparent",
									)}
								>
									{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
								</td>
								<td className="whitespace-pre px-2 py-0.5 text-foreground">{line.content}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
