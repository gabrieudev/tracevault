import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchCombobox } from "@/components/SearchCombobox";
import type { ApplicationResponseDTO } from "@/pages/applications/types";
import type { ChannelType } from "../types";
import type { AlertsSearch } from "@/routes/_app.alerts.index";

interface AlertsFilterBarProps {
	filters: AlertsSearch;
	searchInput: string;
	onSearchInputChange: (value: string) => void;
	onFilterChange: (patch: Partial<AlertsSearch>) => void;
	applications: ApplicationResponseDTO[];
}

export function AlertsFilterBar({
	filters,
	searchInput,
	onSearchInputChange,
	onFilterChange,
	applications,
}: AlertsFilterBarProps) {
	return (
		<div className="flex flex-1 flex-wrap items-end gap-3 rounded-xl border bg-card/60 p-4 shadow-sm backdrop-blur-sm dark:bg-card/40">
			<div className="relative min-w-45 flex-1">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="pl-9"
					placeholder="Buscar por mensagem, aplicação..."
					value={searchInput}
					onChange={(e) => onSearchInputChange(e.target.value)}
				/>
			</div>

			<SearchCombobox
				className="min-w-40 flex-1 sm:flex-initial"
				value={filters.applicationId}
				onChange={(value) => onFilterChange({ applicationId: value, page: 0 })}
				placeholder="Aplicação"
				emptyText="Nenhuma aplicação encontrada."
				options={[
					{ label: "Todas as aplicações", value: "" },
					...applications.map((app) => ({ label: app.name, value: app.id })),
				]}
			/>

			<Select
				value={filters.channelType ?? "ALL"}
				onValueChange={(v) => onFilterChange({ channelType: v === "ALL" ? undefined : (v as ChannelType), page: 0 })}
			>
				<SelectTrigger className="w-36">
					<SelectValue placeholder="Canal" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ALL">Todas aplicações</SelectItem>
					<SelectItem value="WEBHOOK">Webhook</SelectItem>
					<SelectItem value="SLACK">Slack</SelectItem>
					<SelectItem value="DISCORD">Discord</SelectItem>
					<SelectItem value="EMAIL">E-mail</SelectItem>
				</SelectContent>
			</Select>

			<Select
				value={filters.minSeverity ?? "ALL"}
				onValueChange={(v) =>
					onFilterChange({
						minSeverity: v === "ALL" ? undefined : (v as AlertsSearch["minSeverity"]),
						page: 0,
					})
				}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Severidade mínima" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ALL">Qualquer severidade</SelectItem>
					<SelectItem value="INFO">Info</SelectItem>
					<SelectItem value="WARNING">Atenção</SelectItem>
					<SelectItem value="CRITICAL">Crítico</SelectItem>
				</SelectContent>
			</Select>

			<Select
				value={filters.active === undefined ? "ALL" : String(filters.active)}
				onValueChange={(v) => onFilterChange({ active: v === "ALL" ? undefined : v === "true", page: 0 })}
			>
				<SelectTrigger className="w-32">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ALL">Qualquer status</SelectItem>
					<SelectItem value="true">Ativo</SelectItem>
					<SelectItem value="false">Inativo</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
