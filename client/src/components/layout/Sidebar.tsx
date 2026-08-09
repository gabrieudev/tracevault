import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { primaryNav } from "@/config/nav-items";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);

	return (
		<TooltipProvider delayDuration={250}>
			<motion.aside
				className="relative hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
				animate={{
					width: collapsed ? 80 : 256,
				}}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 30,
				}}
			>
				{/* Cabeçalho */}
				<div className={`flex items-center py-6 ${collapsed ? "justify-center px-3" : "gap-2.5 px-6"}`}>
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
						<img src="/favicon.ico" alt="logo" />
					</span>

					{!collapsed && (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col leading-none">
							<span className="text-sm font-semibold">TraceVault</span>
							<span className="font-mono text-[10px] tracking-wide text-muted-foreground">Sistema de Auditoria</span>
						</motion.div>
					)}
				</div>

				{/* Navegação */}
				<nav className="flex-1 space-y-0.5 px-3 py-2">
					{primaryNav.map((item) => {
						const isActive = location.pathname === item.href;

						return (
							<Tooltip key={item.href}>
								<TooltipTrigger asChild>
									<Link
										to={item.href}
										className={`
											relative flex items-center rounded-md py-2.5 text-sm transition-colors
											hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
											${collapsed ? "justify-center px-2" : "gap-3 px-3"}
										`}
									>
										{isActive && (
											<motion.span
												layoutId="sidebar-active-indicator"
												className="absolute inset-0 rounded-md bg-sidebar-accent"
												transition={{
													type: "spring",
													stiffness: 350,
													damping: 30,
												}}
											/>
										)}

										<span
											className="relative z-10 h-3.5 w-0.5 shrink-0 rounded-full"
											style={{
												backgroundColor: isActive ? "var(--sidebar-primary)" : "transparent",
											}}
										/>

										<item.icon
											className="relative z-10 h-4 w-4 shrink-0"
											style={{
												color: isActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
											}}
										/>

										{!collapsed && (
											<span
												className="relative z-10"
												style={{
													color: isActive ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
												}}
											>
												{item.label}
											</span>
										)}
									</Link>
								</TooltipTrigger>

								{/* Tooltip sempre disponível, com a descrição do item */}
								<TooltipContent side="right" className="text-xs">
									{item.description}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</nav>

				{/* Botão de toggle */}
				<Tooltip>
					<TooltipTrigger asChild>
						<motion.button
							type="button"
							onClick={() => setCollapsed((value) => !value)}
							whileHover={{ scale: 1.08 }}
							whileTap={{ scale: 0.95 }}
							className="group absolute top-1/2 -right-4 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
								{collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
							</motion.div>
						</motion.button>
					</TooltipTrigger>
					<TooltipContent side="right">{collapsed ? "Expandir menu" : "Recolher menu"}</TooltipContent>
				</Tooltip>
			</motion.aside>
		</TooltipProvider>
	);
}
