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
			</div>
		</header>
	);
}
