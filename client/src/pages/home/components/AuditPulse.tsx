import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis, XAxis, CartesianGrid } from "recharts";
import { Activity, TrendingDown, TrendingUp, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

interface AuditPulseProps {
	className?: string;
	data?: number[];
}

interface DataPoint {
	index: number;
	value: number;
	isLast: boolean;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		value: number;
		payload: DataPoint;
	}>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
	if (!active || !payload?.length) {
		return null;
	}

	const value = payload[0].value;

	return (
		<div
			className={cn(
				"rounded-lg border",
				"border-border/80",
				"bg-popover text-popover-foreground",
				"px-3 py-2",
				"shadow-xl",
			)}
		>
			<div className="flex items-center gap-2">
				<span className="relative flex size-2">
					<span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
					<span className="relative size-2 rounded-full bg-primary" />
				</span>

				<span className="text-xs font-medium text-muted-foreground">Eventos</span>

				<span className="font-mono text-sm font-bold tabular-nums text-foreground">{value}</span>
			</div>
		</div>
	);
}

interface PulseDotProps {
	cx?: number;
	cy?: number;
	payload?: DataPoint;
}

function PulseDot(props: PulseDotProps) {
	const { cx, cy, payload } = props;

	if (!payload?.isLast || cx == null || cy == null) {
		return null;
	}

	return (
		<g>
			<motion.circle
				cx={cx}
				cy={cy}
				r={5}
				fill="var(--primary)"
				fillOpacity={0.18}
				animate={{
					r: [5, 11, 5],
					opacity: [0.7, 0.05, 0.7],
				}}
				transition={{
					duration: 1.8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<circle cx={cx} cy={cy} r={5} fill="var(--background)" stroke="var(--primary)" strokeWidth={2.5} />

			<circle cx={cx} cy={cy} r={2.5} fill="var(--primary)" />
		</g>
	);
}

export function AuditPulse({ className, data = [] }: AuditPulseProps) {
	const chartId = useId().replace(/:/g, "");

	const gradientId = `auditPulseArea-${chartId}`;

	const chartData = useMemo<DataPoint[]>(() => {
		const normalized = data.length > 1 ? data : Array.from({ length: 12 }, () => 0);

		const lastIndex = normalized.length - 1;

		return normalized.map((value, index) => ({
			index,
			value,
			isLast: index === lastIndex,
		}));
	}, [data]);

	const currentValue = chartData.at(-1)?.value ?? 0;
	const previousValue = chartData.at(-2)?.value ?? currentValue;

	const difference = currentValue - previousValue;

	const trend = difference > 0 ? "up" : difference < 0 ? "down" : "stable";

	const maxValue = Math.max(...chartData.map((item) => item.value), 1);

	const minValue = Math.min(...chartData.map((item) => item.value), 0);

	const range = Math.max(maxValue - minValue, 1);

	const padding = Math.max(range * 0.25, 2);

	const yDomain: [number, number] = [Math.max(0, minValue - padding), maxValue + padding];

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: 5,
			}}
			animate={{
				opacity: 1,
				y: 0,
			}}
			transition={{
				duration: 0.35,
				ease: "easeOut",
			}}
			className={cn(
				"group relative overflow-hidden",
				"rounded-xl",
				"border border-border",
				"bg-card",
				"shadow-sm",
				className,
			)}
		>
			<div className="relative flex h-28 items-center gap-4 px-4 py-3">
				<div className="relative z-10 flex w-28 shrink-0 flex-col">
					<div className="flex items-center gap-1.5">
						<div
							className={cn(
								"flex size-6 items-center justify-center",
								"rounded-md",
								"border border-primary/25",
								"bg-primary/10",
							)}
						>
							<Activity className="size-3.5 text-primary" />
						</div>

						<span className="text-[11px] font-semibold text-muted-foreground">Audit Pulse</span>
					</div>

					<div className="mt-1 flex items-baseline gap-1.5">
						<motion.span
							key={currentValue}
							initial={{
								opacity: 0,
								y: -3,
							}}
							animate={{
								opacity: 1,
								y: 0,
							}}
							className="font-mono text-xl font-bold tracking-tight text-foreground tabular-nums"
						>
							{currentValue}
						</motion.span>

						<span className="text-[10px] text-muted-foreground">eventos</span>
					</div>

					<div className="mt-0.5 flex items-center gap-1 text-[10px]">
						{trend === "up" && (
							<>
								<TrendingUp className="size-3 text-primary" />

								<span className="font-semibold text-primary">+{difference}</span>
							</>
						)}

						{trend === "down" && (
							<>
								<TrendingDown className="size-3 text-muted-foreground" />

								<span className="font-semibold text-muted-foreground">{difference}</span>
							</>
						)}

						{trend === "stable" && (
							<>
								<Minus className="size-3 text-muted-foreground" />

								<span className="font-semibold text-muted-foreground">Estável</span>
							</>
						)}
					</div>
				</div>

				<div className="h-full min-w-0 flex-1">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={chartData}
							margin={{
								top: 18,
								right: 10,
								left: 6,
								bottom: 14,
							}}
						>
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="var(--primary)" stopOpacity={0.38} />

									<stop offset="45%" stopColor="var(--primary)" stopOpacity={0.18} />

									<stop offset="100%" stopColor="var(--primary)" stopOpacity={0.03} />
								</linearGradient>
							</defs>

							<XAxis dataKey="index" hide />

							<YAxis hide domain={yDomain} />

							<CartesianGrid horizontal vertical={false} stroke="var(--border)" strokeOpacity={0.55} strokeDasharray="3 7" />

							<Tooltip
								content={<CustomTooltip />}
								cursor={{
									stroke: "var(--primary)",
									strokeWidth: 1,
									strokeDasharray: "4 4",
									strokeOpacity: 0.3,
								}}
							/>

							<Area
								type="monotone"
								dataKey="value"
								stroke="var(--primary)"
								strokeWidth={7}
								strokeOpacity={0.12}
								fill="none"
								isAnimationActive={false}
								dot={false}
								activeDot={false}
							/>

							<Area
								type="monotone"
								dataKey="value"
								stroke="var(--primary)"
								strokeWidth={3}
								strokeOpacity={1}
								fill={`url(#${gradientId})`}
								connectNulls
								isAnimationActive
								animationDuration={900}
								animationEasing="ease-out"
								dot={<PulseDot />}
								activeDot={{
									r: 5,
									fill: "var(--primary)",
									stroke: "var(--background)",
									strokeWidth: 2.5,
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-primary/40" />
		</motion.div>
	);
}
