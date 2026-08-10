import { motion } from "framer-motion";
import { useMemo } from "react";

interface AuditPulseProps {
	className?: string;
	data?: number[];
}

export function AuditPulse({ className, data = [] }: AuditPulseProps) {
	// Fallback para uma linha neutra se não houver dados da API
	const normalizedData = data.length > 1 ? data : Array(20).fill(10);

	const { linePath, areaPath, lastPoint } = useMemo(() => {
		const width = 700;
		const height = 80;
		const paddingY = 15;
		const usableHeight = height - paddingY * 2;

		const max = Math.max(...normalizedData, 1);
		const min = Math.min(...normalizedData, 0);
		const range = max - min || 1;

		const getX = (index: number) => (index / (normalizedData.length - 1)) * width;
		const getY = (value: number) => {
			const scaled = (value - min) / range;
			return height - paddingY - scaled * usableHeight;
		};

		const points = normalizedData.map((val, i) => `${getX(i)},${getY(val)}`);

		const linePath = `M ${points.join(" L ")}`;
		const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

		const lastPoint = {
			x: getX(normalizedData.length - 1),
			y: getY(normalizedData[normalizedData.length - 1]),
		};

		return { linePath, areaPath, lastPoint };
	}, [normalizedData]);

	return (
		<div className={className}>
			<svg
				viewBox="0 0 700 80"
				className="h-16 w-full text-zinc-900 dark:text-zinc-100 md:h-20"
				preserveAspectRatio="none"
				fill="none"
				role="img"
				aria-label="Visualização em tempo real de eventos da API"
			>
				<title>Audit Pulse API</title>

				<defs>
					<linearGradient id="pulse-gradient" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
						<stop offset="100%" stopColor="currentColor" stopOpacity="0" />
					</linearGradient>
				</defs>

				<line
					x1="0"
					y1="65"
					x2="700"
					y2="65"
					stroke="currentColor"
					strokeOpacity="0.1"
					strokeWidth="1"
					strokeDasharray="4 4"
				/>

				<motion.path
					d={areaPath}
					fill="url(#pulse-gradient)"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
				/>

				<motion.path
					d={linePath}
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{ duration: 1.5, ease: "easeOut" }}
				/>

				<motion.circle
					cx={lastPoint.x}
					cy={lastPoint.y}
					r={4}
					fill="currentColor"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
					transition={{
						delay: 1.5,
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</svg>
		</div>
	);
}
