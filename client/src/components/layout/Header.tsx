import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Bell, LogOut } from "lucide-react";
import { ModeToggle } from "../ModeToggle";

interface HeaderProps {
	title: string;
	subtitle?: string;
	userName?: string;
	userEmail?: string;
	userAvatarUrl?: string;
	hasUnreadNotifications?: boolean;
}

export function Header({
	title,
	subtitle,
	userName = "Admin",
	userEmail = "admin@empresa.com",
	userAvatarUrl,
	hasUnreadNotifications = true,
}: HeaderProps) {
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<header className="flex items-center justify-between border-b border-border bg-background px-4 py-4 md:px-8">
			<div>
				<motion.h1
					initial={{ opacity: 0, y: -4 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="text-lg font-semibold md:text-xl"
				>
					{title}
				</motion.h1>
				{subtitle && <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
			</div>

			<div className="flex items-center gap-2">
				<ModeToggle />

				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-4.5 w-4.5" />
					{hasUnreadNotifications && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />}
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted"
						>
							<Avatar className="h-8 w-8">
								<AvatarImage src={userAvatarUrl} alt={userName} />
								<AvatarFallback className="bg-muted font-mono text-[11px] text-foreground">{initials}</AvatarFallback>
							</Avatar>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel className="flex flex-col">
							<span className="text-sm font-medium text-foreground">{userName}</span>
							<span className="font-mono text-xs font-normal text-muted-foreground">{userEmail}</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2">
							<Bell className="h-4 w-4" /> Notificações
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2">
							<LogOut className="h-4 w-4" /> Sair
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
