import type { ApplicationResponseDTO } from "@/pages/applications/types";

export type ChannelType = "WEBHOOK" | "SLACK" | "EMAIL" | "DISCORD";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export const CHANNEL_TYPES: ChannelType[] = ["WEBHOOK", "SLACK", "EMAIL", "DISCORD"];

export interface AlertRuleResponseDTO {
	id: string;
	application: ApplicationResponseDTO;
	triggerEvents: string[];
	minSeverity: AlertSeverity;
	channelType: ChannelType;
	channelConfig: Record<string, unknown>;
	messageTemplate?: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AlertRuleRequestDTO {
	applicationId: string;
	triggerEvents: string[];
	minSeverity: AlertSeverity;
	channelType: ChannelType;
	channelConfig: Record<string, unknown>;
	messageTemplate?: string;
}

export interface UpdateAlertRuleDTO {
	triggerEvents: string[];
	minSeverity: AlertSeverity;
	channelType: ChannelType;
	channelConfig: Record<string, unknown>;
	messageTemplate?: string;
	active: boolean;
}

export interface AlertRuleFilters {
	id?: string;
	search?: string;
	applicationId?: string;
	messageTemplate?: string;
	channelType?: ChannelType;
	triggerEvents?: string[];
	minSeverity?: AlertSeverity;
	active?: boolean;
	createdFrom?: string;
	createdTo?: string;
	updatedFrom?: string;
	updatedTo?: string;
	page?: number;
	size?: number;
	sort?: string[];
}
