import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ApplicationStatus } from "../types";

interface ApplicationsFilterBarProps {
	search: string;
	status: ApplicationStatus | "ALL";
	onSearchChange: (value: string) => void;
	onStatusChange: (value: ApplicationStatus | "ALL") => void;
}

export function ApplicationsFilterBar({ search, status, onSearchChange, onStatusChange }: ApplicationsFilterBarProps) {
	return (
		<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
			<div className="relative flex-1 sm:max-w-sm">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Buscar por nome ou descrição..."
					className="pl-9"
				/>
			</div>

			<Select value={status} onValueChange={(v) => onStatusChange(v as ApplicationStatus | "ALL")}>
				<SelectTrigger className="sm:w-44">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ALL">Todos os status</SelectItem>
					<SelectItem value="ACTIVE">Ativa</SelectItem>
					<SelectItem value="INACTIVE">Inativa</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
