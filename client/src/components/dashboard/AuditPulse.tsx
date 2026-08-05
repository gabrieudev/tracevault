import { motion } from "framer-motion";

interface AuditPulseProps {
	className?: string;
}

const PULSE_PATH =
	"M0,40 L60,40 L78,40 L90,14 L102,64 L114,40 L150,40 L170,40 L184,22 L198,40 L230,40 L250,40 L262,52 L274,40 L420,40 L440,40 L455,8 L470,64 L484,40 L520,40 L538,40 L552,24 L566,40 L600,40 L620,40 L632,54 L644,40 L700,40";

export function AuditPulse({ className }: AuditPulseProps) {
	return (
		<div className={className}>
			<svg
				viewBox="0 0 700 80"
				className="h-16 w-full text-primary md:h-20"
				preserveAspectRatio="none"
				fill="none"
				role="img"
				aria-label="Audit pulse visualization showing continuous event flow"
			>
				<title>Audit Pulse</title>
				<line
					x1="0"
					y1="40"
					x2="700"
					y2="40"
					stroke="currentColor"
					strokeOpacity="0.2"
					strokeWidth="1"
					strokeDasharray="2 6"
				/>

				<motion.path
					d={PULSE_PATH}
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{ duration: 1.6, ease: "easeInOut" }}
				/>

				<motion.circle
					cy={40}
					r={4}
					fill="currentColor"
					initial={{ cx: 0, opacity: 0 }}
					animate={{ cx: 700, opacity: [0, 1, 0.8, 0] }}
					transition={{
						delay: 1.6,
						duration: 2.8,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
			</svg>
		</div>
	);
}
