import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";

import type { LogsSearch } from "@/routes/_app.logs.index";
import { AuditLogsFilterBar } from "./components/AuditLogsFilterBar";
import { AuditLogsTable } from "./components/AuditLogsTable";
import { useApplicationsForFilter } from "./use-applications-for-filter";
import { useAuditLogs } from "./use-audit-logs";

const SEARCH_DEBOUNCE_MS = 400;

export function AuditLogsPage() {
	const { search, applicationId, action, severity, actorId, resourceType, occurredFrom, occurredTo, page } = useSearch({
		from: "/_app/logs/",
	});

	const navigate = useNavigate({
		from: "/logs/",
	});

	const [searchInput, setSearchInput] = useState(search ?? "");

	const { data: applicationsData } = useApplicationsForFilter();

	const { data, isLoading } = useAuditLogs({
		search,
		applicationId,
		action,
		severity: severity && severity !== "ALL" ? severity : undefined,
		actorId,
		resourceType,
		occurredAtFrom: occurredFrom,
		occurredAtTo: occurredTo,
		page,
		size: 10,
		sort: ["occurredAt,desc"],
	});

	useEffect(() => {
		setSearchInput(search ?? "");
	}, [search]);

	useEffect(() => {
		const normalizedSearch = searchInput.trim();

		if (normalizedSearch === (search ?? "")) {
			return;
		}

		const timeout = setTimeout(() => {
			navigate({
				search: (prev) => ({
					...prev,
					search: normalizedSearch || undefined,
					page: 0,
				}),
			});
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			clearTimeout(timeout);
		};
	}, [searchInput, search, navigate]);

	const updateSearch = useCallback((patch: Partial<LogsSearch>) => {
		navigate({
			search: (prev) => ({
				...prev,
				...patch,
			}),
		});
	}, [navigate]);

	const handleFilterChange = useCallback((patch: Partial<LogsSearch>) => {
		updateSearch({ ...patch, page: 0 });
	}, [updateSearch]);

	const handlePageChange = useCallback((nextPage: number) => {
		updateSearch({ page: nextPage });
	}, [updateSearch]);

	return (
		<div className="space-y-5">
			<AuditLogsFilterBar
				filters={{ search, applicationId, action, severity, actorId, resourceType, occurredFrom, occurredTo, page }}
				searchInput={searchInput}
				onSearchInputChange={setSearchInput}
				onFilterChange={handleFilterChange}
				applications={applicationsData?.content ?? []}
			/>

			<AuditLogsTable
				data={data}
				isLoading={isLoading}
				page={page}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}