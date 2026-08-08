import type { ApplicationResponseDTO } from "@/pages/applications/types";

export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

// Enum "action" exatamente como declarado no Swagger (AuditLogRequestDTO/ResponseDTO)
export const AUDIT_ACTIONS = [
	"CREATE",
	"READ",
	"UPDATE",
	"DELETE",
	"LOGIN",
	"LOGOUT",
	"LOGIN_FAILED",
	"TOKEN_REFRESH",
	"ACCESS_GRANTED",
	"ACCESS_DENIED",
	"API_REQUEST",
	"API_RESPONSE",
	"APPLICATION_CREATED",
	"APPLICATION_UPDATED",
	"APPLICATION_DELETED",
	"APPLICATION_ENABLED",
	"APPLICATION_DISABLED",
	"API_KEY_GENERATED",
	"API_KEY_REVOKED",
	"USER_CREATED",
	"USER_UPDATED",
	"USER_DELETED",
	"USER_ENABLED",
	"USER_DISABLED",
	"CONFIG_CREATED",
	"CONFIG_UPDATED",
	"CONFIG_DELETED",
	"EXPORT",
	"IMPORT",
	"SERVICE_STARTED",
	"SERVICE_STOPPED",
	"SECURITY_ALERT",
	"SUSPICIOUS_ACTIVITY",
	"CUSTOM_EVENT",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLogResponseDTO {
	id: string;
	application: ApplicationResponseDTO;
	actorId: string;
	actorName?: string;
	actorIp?: string;
	actorUserAgent?: string;
	action: AuditAction;
	resourceType: string;
	resourceId: string;
	oldValues?: Record<string, unknown>;
	newValues?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
	severity: AuditSeverity;
	occurredAt: string;
	createdAt: string;
}

export interface AuditLogFilters {
	id?: string;
	search?: string;
	applicationId?: string;
	actorId?: string;
	actorName?: string;
	actorIp?: string;
	actorUserAgent?: string;
	action?: AuditAction;
	resourceType?: string;
	resourceId?: string;
	severity?: AuditSeverity;
	occurredAtFrom?: string;
	occurredAtTo?: string;
	createdFrom?: string;
	createdTo?: string;
	page?: number;
	size?: number;
	sort?: string[];
}
