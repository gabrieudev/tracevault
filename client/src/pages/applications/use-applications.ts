import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createApplication,
	getApplication,
	listApplications,
	rotateApiKey,
	updateApplication,
} from "@/lib/api/applications";
import type { ApplicationFilters, ApplicationRequestDTO, UpdateApplicationDTO } from "./types";
import { toast } from "sonner";

export const applicationsKeys = {
	all: ["applications"] as const,
	lists: () => [...applicationsKeys.all, "list"] as const,
	list: (filters: ApplicationFilters) => [...applicationsKeys.lists(), filters] as const,
	details: () => [...applicationsKeys.all, "detail"] as const,
	detail: (id: string) => [...applicationsKeys.details(), id] as const,
};

export function useApplications(filters: ApplicationFilters) {
	return useQuery({
		queryKey: applicationsKeys.list(filters),
		queryFn: () => listApplications(filters),
		placeholderData: (previous) => previous,
	});
}

export function useApplication(id: string) {
	return useQuery({
		queryKey: applicationsKeys.detail(id),
		queryFn: () => getApplication(id),
		enabled: Boolean(id),
	});
}

export function useCreateApplication() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ApplicationRequestDTO) => createApplication(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationsKeys.lists() });
			toast.success("Aplicação criada com sucesso!", {
				position: "bottom-right",
			});
		},
		onError: (error) => {
			toast.error(error?.message || "Erro ao criar aplicação", {
				position: "bottom-right",
			});
		},
	});
}

export function useUpdateApplication(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateApplicationDTO) => updateApplication(id, data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({ queryKey: applicationsKeys.lists() });
			queryClient.setQueryData(applicationsKeys.detail(id), updated);
			toast.success("Aplicação atualizada com sucesso!", {
				position: "bottom-right",
			});
		},
		onError: (error) => {
			toast.error(error?.message || "Erro ao atualizar aplicação", {
				position: "bottom-right",
			});
		},
	});
}

export function useRotateApiKey(id: string) {
	return useMutation({
		mutationFn: (currentApiKey: string) => rotateApiKey(id, currentApiKey),
		onSuccess: () => {
			toast.success("Chave de API rotacionada com sucesso!", {
				position: "bottom-right",
			});
		},
		onError: (error) => {
			toast.error(error?.message || "Erro ao rotacionar chave de API", {
				position: "bottom-right",
			});
		},
	});
}
