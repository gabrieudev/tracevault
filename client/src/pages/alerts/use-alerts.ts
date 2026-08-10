import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAlertRule, getAlertRule, listAlertRules, updateAlertRule } from "@/lib/api/alerts";
import type { AlertRuleFilters, AlertRuleRequestDTO, UpdateAlertRuleDTO } from "./types";

export const alertsKeys = {
	all: ["alert-rules"] as const,
	lists: () => [...alertsKeys.all, "list"] as const,
	list: (filters: AlertRuleFilters) => [...alertsKeys.lists(), filters] as const,
	details: () => [...alertsKeys.all, "detail"] as const,
	detail: (id: string) => [...alertsKeys.details(), id] as const,
};

export function useAlerts(filters: AlertRuleFilters) {
	return useQuery({
		queryKey: alertsKeys.list(filters),
		queryFn: () => listAlertRules(filters),
		placeholderData: (previous) => previous,
	});
}

export function useAlert(id: string) {
	return useQuery({
		queryKey: alertsKeys.detail(id),
		queryFn: () => getAlertRule(id),
		enabled: Boolean(id),
	});
}

export function useCreateAlert() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: AlertRuleRequestDTO) => createAlertRule(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: alertsKeys.lists() });
			toast.success("Alerta criado com sucesso!", {
				position: "bottom-right",
			});
		},
		onError: (error) => {
			toast.error(error?.message || "Erro ao criar webhook", {
				position: "bottom-right",
			});
		},
	});
}

export function useUpdateAlert(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateAlertRuleDTO) => updateAlertRule(id, data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({ queryKey: alertsKeys.lists() });
			queryClient.setQueryData(alertsKeys.detail(id), updated);
			toast.success("Alerta atualizado com sucesso!", {
				position: "bottom-right",
			});
		},
		onError: (error) => {
			toast.error(error?.message || "Erro ao atualizar alerta", {
				position: "bottom-right",
			});
		},
	});
}
