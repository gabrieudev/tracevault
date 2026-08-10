import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AUDIT_ACTIONS, type AuditAction } from "@/pages/logs/types";

const EVENT_OPTIONS = AUDIT_ACTIONS.filter((action) => action !== "ALL");

const EVENT_LABELS: Partial<Record<AuditAction, string>> = {
	CREATE: "Criação",
	READ: "Leitura",
	UPDATE: "Atualização",
	DELETE: "Remoção",
	LOGIN: "Login",
	LOGOUT: "Logout",
	LOGIN_FAILED: "Falha de login",
	ACCESS_DENIED: "Acesso negado",
	ACCESS_GRANTED: "Acesso concedido",
	SECURITY_ALERT: "Alerta de segurança",
	SUSPICIOUS_ACTIVITY: "Atividade suspeita",
	EXPORT: "Exportação",
	IMPORT: "Importação",
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

interface EventsMultiSelectProps {
	value: string[];
	onChange: (value: string[]) => void;
	className?: string;
}

export function EventsMultiSelect({ value, onChange, className }: EventsMultiSelectProps) {
	const [open, setOpen] = useState(false);

	function toggle(action: string) {
		onChange(value.includes(action) ? value.filter((v) => v !== action) : [...value, action]);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn("w-full justify-between font-normal", value.length === 0 && "text-muted-foreground")}
					>
						<span className="truncate">
							{value.length === 0
								? "Selecionar eventos..."
								: `${value.length} evento${value.length > 1 ? "s" : ""} selecionado${value.length > 1 ? "s" : ""}`}
						</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-72 p-0" align="start">
					<Command>
						<CommandInput placeholder="Buscar evento..." />
						<CommandList>
							<CommandEmpty>Nenhum evento encontrado.</CommandEmpty>
							<CommandGroup>
								{EVENT_OPTIONS.map((action) => (
									<CommandItem key={action} value={EVENT_LABELS[action] ?? action} onSelect={() => toggle(action)}>
										<Check className={cn("mr-2 h-4 w-4", value.includes(action) ? "opacity-100" : "opacity-0")} />
										<span className="truncate">{EVENT_LABELS[action] ?? action}</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{value.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{value.map((action) => (
						<span
							key={action}
							className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground"
						>
							{action}
							<button
								type="button"
								onClick={() => toggle(action)}
								className="text-muted-foreground hover:text-foreground"
								aria-label={`Remover ${action}`}
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
