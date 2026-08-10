import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
	label: string;
	value: string;
	icon: LucideIcon;
	delta?: {
		value: string;
		direction: "up" | "down";
		tone: "positive" | "negative";
	};
	index?: number;
}

export function StatCard({ label, value, icon: Icon, delta, index = 0 }: StatCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
			whileHover={{ y: -2 }}
		>
			<Card className="border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
					<span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
						<Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
					</span>
				</CardHeader>
				<CardContent>
					<div className="flex items-end justify-between">
						<span className="font-mono text-2xl font-semibold text-foreground tracking-tight">{value}</span>
						{delta && (
							<div
								className={cn(
									"flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
									delta.tone === "negative"
										? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
										: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
								)}
							>
								{delta.direction === "up" ? (
									<ArrowUpRight className="h-3.5 w-3.5" />
								) : (
									<ArrowDownRight className="h-3.5 w-3.5" />
								)}
								{delta.value}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
