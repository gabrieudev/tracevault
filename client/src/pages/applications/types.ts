export type ApplicationStatus = "ACTIVE" | "INACTIVE";

export interface ApplicationResponseDTO {
	id: string;
	name: string;
	description?: string;
	status: ApplicationStatus;
	createdAt: string;
	updatedAt: string;
}

export interface ApplicationRequestDTO {
	name: string;
	description?: string;
}

export interface UpdateApplicationDTO {
	name: string;
	description?: string;
	status: ApplicationStatus;
}

export interface PlainKeyResponseDTO {
	id: string;
	plainKey: string;
}

export interface PageResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
}

export interface ApplicationFilters {
	id?: string;
	search?: string;
	name?: string;
	description?: string;
	status?: ApplicationStatus[];
	createdFrom?: string;
	createdTo?: string;
	updatedFrom?: string;
	updatedTo?: string;
	page?: number;
	size?: number;
	sort?: string[];
}
