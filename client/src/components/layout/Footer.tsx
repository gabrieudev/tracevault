import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<motion.footer
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="mt-auto border-t bg-background/80 backdrop-blur-sm"
		>
			<div className="container mx-auto px-4 py-4">
				<div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
					<div className="flex items-center gap-2">
						<img className="w-6 h-6" src="/favicon.ico" alt="logo" />
						<span className="text-sm font-semibold tracking-tight">TraceVault</span>
					</div>

					<a
						href="https://github.com/gabrieudev/tracevault"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<FaGithub className="h-3.5 w-3.5" />
						GitHub
					</a>

					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span>v1.0.0</span>
						<Separator orientation="vertical" className="h-3" />
						<span>&copy; {currentYear}</span>
					</div>
				</div>
			</div>
		</motion.footer>
	);
}
