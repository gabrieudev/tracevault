import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ApplicationResponseDTO } from "@/pages/applications/types";
import { AUDIT_ACTIONS, type AuditAction } from "../types";
import type { LogsSearch } from "@/routes/_app.logs.index";
import { SearchCombobox } from "@/components/SearchCombobox";
import { DatePicker } from "@/components/DatePicker";
import { useDebounce } from "@/hooks/use-debounce";

const ACTION_LABELS: Partial<Record<AuditAction, string>> = {
	CREATE: "Criação",
	READ: "Leitura",
	UPDATE: "Atualização",
	DELETE: "Remoção",
	LOGIN: "Login",
	LOGOUT: "Logout",
	LOGIN_FAILED: "Falha de login",
	ACCESS_DENIED: "Acesso negado",
	SECURITY_ALERT: "Alerta de segurança",
	SUSPICIOUS_ACTIVITY: "Atividade suspeita",
	EXPORT: "Exportação",
	IMPORT: "Importação",
	ACCESS_GRANTED: "Acesso concedido",
	API_KEY_GENERATED: "Chave de API gerada",
	API_KEY_REVOKED: "Chave de API revogada",
	TOKEN_REFRESH: "Token atualizado",
	API_REQUEST: "Requisição de API",
	API_RESPONSE: "Resposta de API",
	APPLICATION_CREATED: "Aplicação criada",
	APPLICATION_UPDATED: "Aplicação atualizada",
	APPLICATION_DELETED: "Aplicação removida",
	APPLICATION_ENABLED: "Aplicação habilitada",
	APPLICATION_DISABLED: "Aplicação desabilitada",
	USER_CREATED: "Usuário criado",
	USER_UPDATED: "Usuário atualizado",
	USER_DELETED: "Usuário removido",
	USER_ENABLED: "Usuário habilitado",
	USER_DISABLED: "Usuário desabilitado",
	CONFIG_CREATED: "Configuração criada",
	CONFIG_UPDATED: "Configuração atualizada",
	CONFIG_DELETED: "Configuração removida",
	SERVICE_STARTED: "Serviço iniciado",
	SERVICE_STOPPED: "Serviço parado",
	CUSTOM_EVENT: "Evento customizado",
};

interface AuditLogsFilterBarProps {
	filters: LogsSearch;
	searchInput: string;
	onSearchInputChange: (value: string) => void;
	onFilterChange: (patch: Partial<LogsSearch>) => void;
	applications: ApplicationResponseDTO[];
}

export function AuditLogsFilterBar({
	filters,
	searchInput,
	onSearchInputChange,
	onFilterChange,
	applications,
}: AuditLogsFilterBarProps) {
	const [advancedOpen, setAdvancedOpen] = useState(false);
	const [actorIdInput, setActorIdInput] = useState(filters.actorId ?? "");
	const [resourceTypeInput, setResourceTypeInput] = useState(filters.resourceType ?? "");

	const debouncedSearch = useDebounce(searchInput, 500);

	const debouncedActorId = useDebounce(actorIdInput, 500);

	const debouncedResourceType = useDebounce(resourceTypeInput, 500);

	const activeAdvancedCount = [filters.actorId, filters.resourceType, filters.occurredFrom, filters.occurredTo].filter(
		Boolean,
	).length;

	function clearAdvanced() {
		setActorIdInput("");
		setResourceTypeInput("");

		onFilterChange({
			actorId: undefined,
			resourceType: undefined,
			occurredFrom: undefined,
			occurredTo: undefined,
		});
	}

	function parseDate(value?: string) {
		if (!value) return undefined;

		return new Date(value);
	}

	function formatDate(value?: Date) {
		if (!value) return undefined;

		return value.toISOString();
	}

	useEffect(() => {
		onSearchInputChange(debouncedSearch);
	}, [debouncedSearch, onSearchInputChange]);

	useEffect(() => {
		onFilterChange({
			actorId: debouncedActorId || undefined,
		});
	}, [debouncedActorId, onFilterChange]);

	useEffect(() => {
		onFilterChange({
			resourceType: debouncedResourceType || undefined,
		});
	}, [debouncedResourceType, onFilterChange]);

	return (
		<div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
				<div className="relative flex-1 lg:max-w-sm">
					<Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Buscar..." value={searchInput} onChange={(e) => onSearchInputChange(e.target.value)} />
				</div>

				<SearchCombobox
					className="lg:w-48"
					value={filters.applicationId}
					onChange={(value) =>
						onFilterChange({
							applicationId: value,
						})
					}
					placeholder="Aplicação"
					emptyText="Nenhuma aplicação encontrada."
					options={[
						{
							label: "Todas as aplicações",
							value: "",
						},
						...applications.map((app) => ({
							label: app.name,
							value: app.id,
						})),
					]}
				/>

				<SearchCombobox
					className="lg:w-52"
					value={filters.action}
					onChange={(value) =>
						onFilterChange({
							action: value as AuditAction | undefined,
						})
					}
					placeholder="Ação"
					emptyText="Nenhuma ação encontrada."
					options={[
						...AUDIT_ACTIONS.map((action) => ({
							label: ACTION_LABELS[action] ?? action,
							value: action,
						})),
					]}
				/>

				<Select
					value={filters.severity ?? "ALL"}
					onValueChange={(v) => onFilterChange({ severity: v as LogsSearch["severity"] })}
				>
					<SelectTrigger className="lg:w-36">
						<SelectValue placeholder="Severidade" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">Todas</SelectItem>
						<SelectItem value="INFO">Info</SelectItem>
						<SelectItem value="WARNING">Atenção</SelectItem>
						<SelectItem value="CRITICAL">Crítico</SelectItem>
					</SelectContent>
				</Select>

				<Button
					type="button"
					variant={advancedOpen || activeAdvancedCount > 0 ? "secondary" : "ghost"}
					size="sm"
					className="gap-1.5"
					onClick={() => setAdvancedOpen((v) => !v)}
				>
					<SlidersHorizontal className="h-3.5 w-3.5" />
					Mais filtros
					{activeAdvancedCount > 0 && (
						<span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
							{activeAdvancedCount}
						</span>
					)}
				</Button>
			</div>

			<AnimatePresence initial={false}>
				{advancedOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="overflow-hidden"
					>
						<div className="grid grid-cols-1 gap-3 border-t pt-3 sm:grid-cols-2 lg:grid-cols-4">
							<div className="space-y-1.5">
								<label htmlFor="actorId" className="text-xs font-medium text-muted-foreground">
									Ator (ID)
								</label>
								<Input value={actorIdInput} onChange={(e) => setActorIdInput(e.target.value)} placeholder="usr_123 ou e-mail" />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="resourceType" className="text-xs font-medium text-muted-foreground">
									Tipo de recurso
								</label>
								<Input
									value={resourceTypeInput}
									onChange={(e) => setResourceTypeInput(e.target.value)}
									placeholder="Ex: User, Invoice"
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="occurredFrom" className="text-xs font-medium text-muted-foreground">
									Ocorrido de
								</label>
								<DatePicker
									className="w-full"
									value={parseDate(filters.occurredFrom)}
									onChange={(date) =>
										onFilterChange({
											occurredFrom: formatDate(date),
										})
									}
									placeholder="Data inicial"
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="occurredTo" className="text-xs font-medium text-muted-foreground">
									Ocorrido até
								</label>
								<DatePicker
									className="w-full"
									value={parseDate(filters.occurredTo)}
									onChange={(date) =>
										onFilterChange({
											occurredTo: formatDate(date),
										})
									}
									placeholder="Data final"
								/>
							</div>
						</div>

						{activeAdvancedCount > 0 && (
							<div className="mt-3 flex justify-end">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="gap-1 text-xs text-muted-foreground"
									onClick={clearAdvanced}
								>
									<X className="h-3 w-3" /> Limpar filtros avançados
								</Button>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
