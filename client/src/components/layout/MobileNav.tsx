import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, Bug, ScrollText } from "lucide-react";
import { primaryNav } from "@/config/nav-items";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const bottomShortcuts = primaryNav.slice(0, 3);

export function MobileNav() {
	const location = useLocation();

	return (
		<>
			{/* Barra superior */}
			<div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
				<div className="flex items-center gap-2">
					<span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
						<ScrollText className="h-3.5 w-3.5 text-foreground" />
					</span>
					<span className="text-sm font-semibold text-foreground">Audit Trail</span>
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-72 p-0">
						<SheetHeader className="px-6 py-5 text-left">
							<SheetTitle className="text-foreground">Navegação</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col gap-1 px-3">
							{primaryNav.map((item) => {
								const isActive = location.pathname === item.href;
								return (
									<Link
										key={item.href}
										to={item.href}
										className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-muted"
										style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
									>
										<item.icon className="h-4 w-4" style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }} />
										{item.label}
									</Link>
								);
							})}
						</nav>
					</SheetContent>
				</Sheet>
			</div>

			{/* Barra inferior fixa */}
			<nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background px-2 py-2 md:hidden">
				{bottomShortcuts.map((item) => {
					const isActive = location.pathname === item.href;
					return (
						<Link
							key={item.href}
							to={item.href}
							className="flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-[10px] transition-colors hover:bg-muted"
							style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
						>
							<item.icon className="h-4.5 w-4.5" />
							{item.label}
						</Link>
					);
				})}

				{/* Reportar Bug */}
				<Link to="/chamados/novo" search={{ tipo: "bug" }} className="flex flex-col items-center gap-1 px-3 py-1.5">
					<motion.span
						whileTap={{ scale: 0.92 }}
						className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive"
					>
						<Bug className="h-4.5 w-4.5 text-white" />
					</motion.span>
					<span className="text-[10px] text-destructive">Bug</span>
				</Link>
			</nav>
		</>
	);
}
