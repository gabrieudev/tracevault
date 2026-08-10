export type TrendDirection = "UP" | "DOWN" | "FLAT";
export type Severity = "INFO" | "WARNING" | "CRITICAL";

export interface StatMetricDTO {
	value: number;
	delta?: number;
	trend?: TrendDirection;
}

export interface AuditPulseMetricsDTO {
	timestamps: string[];
	data: number[];
}

export interface HomeStatsDTO {
	eventsToday: StatMetricDTO;
	activeApplications: {
		active: number;
		total: number;
	};
	criticalAlerts24h: StatMetricDTO;
	loginFailures24h: StatMetricDTO;
}

export interface ApplicationVolumeDTO {
	name: string;
	eventsCount: number;
	percentage: number;
}

export interface RecentEventDTO {
	id: string;
	action: string;
	resourceType: string;
	resourceId: string;
	actorName: string;
	severity: Severity;
	occurredAt: string;
}

export interface HomeSummaryResponseDTO {
	auditPulse: AuditPulseMetricsDTO;
	stats: HomeStatsDTO;
	applicationsVolume: ApplicationVolumeDTO[];
	recentEvents: RecentEventDTO[];
}

export interface HomeFilters {
	applicationId?: string;
	pulseWindowMinutes?: number;
}
