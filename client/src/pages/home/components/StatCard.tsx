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
		>
			<Card className="border-border bg-card shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
					<span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
						<Icon className="h-4 w-4 text-foreground" />
					</span>
				</CardHeader>
				<CardContent>
					<div className="flex items-end justify-between">
						<span className="font-mono text-2xl font-semibold text-foreground">{value}</span>
						{delta && (
							<span
								className={cn(
									"flex items-center gap-0.5 text-xs font-medium",
									delta.tone === "negative" ? "text-destructive" : "text-primary",
								)}
							>
								{delta.direction === "up" ? (
									<ArrowUpRight className="h-3.5 w-3.5" />
								) : (
									<ArrowDownRight className="h-3.5 w-3.5" />
								)}
								{delta.value}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
