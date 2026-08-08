import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { primaryNav } from "@/config/nav-items";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Sidebar() {
	const location = useLocation();

	return (
		<aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
			{/* Logo */}
			<div className="flex items-center gap-2.5 px-6 py-6">
				<span className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
					<img src="/favicon.ico" alt="logo" />
				</span>
				<div className="flex flex-col leading-none">
					<span className="text-sm font-semibold">Audit Trail</span>
					<span className="font-mono text-[10px] tracking-wide text-muted-foreground">Sistema de Auditoria</span>
				</div>
			</div>

			<TooltipProvider delayDuration={250}>
				<nav className="flex-1 space-y-0.5 px-3 py-2">
					{primaryNav.map((item) => {
						const isActive = location.pathname === item.href;
						return (
							<Tooltip key={item.href}>
								<TooltipTrigger asChild>
									<Link
										to={item.href}
										className="relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
									>
										{isActive && (
											<motion.span
												layoutId="sidebar-active-indicator"
												className="absolute inset-0 rounded-md bg-sidebar-accent"
												transition={{ type: "spring", stiffness: 350, damping: 30 }}
											/>
										)}

										<span
											className="relative z-10 h-3.5 w-0.75 shrink-0 rounded-full transition-colors"
											style={{
												backgroundColor: isActive ? "var(--sidebar-primary)" : "transparent",
											}}
										/>

										<item.icon
											className="relative z-10 h-4 w-4 shrink-0 transition-colors"
											style={{
												color: isActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
											}}
										/>

										<span
											className="relative z-10 transition-colors"
											style={{ color: isActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)" }}
										>
											{item.label}
										</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right" className="text-xs">
									{item.description}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</nav>
			</TooltipProvider>

			<div className="border-t border-sidebar-border px-6 py-4">
				<p className="font-mono text-[10px] leading-relaxed text-muted-foreground">logs imutáveis · sem update/delete</p>
			</div>
		</aside>
	);
}
