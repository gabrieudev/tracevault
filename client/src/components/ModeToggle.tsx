import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	const isDark = theme === "dark";

	function toggleTheme() {
		setTheme(isDark ? "light" : "dark");
	}

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
		>
			<AnimatePresence mode="wait" initial={false}>
				{isDark ? (
					<motion.div
						key="moon"
						initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
						transition={{ duration: 0.2 }}
					>
						<Moon className="size-4" />
					</motion.div>
				) : (
					<motion.div
						key="sun"
						initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
						transition={{ duration: 0.2 }}
					>
						<Sun className="size-4" />
					</motion.div>
				)}
			</AnimatePresence>

			<span className="sr-only">Alterar tema</span>
		</Button>
	);
}
