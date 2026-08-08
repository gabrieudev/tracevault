import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { AuditLogsFilterBar } from "./components/AuditLogsFilterBar";
import { AuditLogsTable } from "./components/AuditLogsTable";
import { useAuditLogs } from "./use-audit-logs";
import { useApplicationsForFilter } from "./use-applications-for-filter";
import type { LogsSearch } from "@/routes/_app.logs.index";

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

	function updateSearch(patch: Partial<LogsSearch>) {
		navigate({
			search: (prev) => ({
				...prev,
				...patch,
			}),
		});
	}

	return (
		<div className="space-y-5">
			<AuditLogsFilterBar
				filters={{ search, applicationId, action, severity, actorId, resourceType, occurredFrom, occurredTo, page }}
				searchInput={searchInput}
				onSearchInputChange={setSearchInput}
				onFilterChange={(patch) => updateSearch({ ...patch, page: 0 })}
				applications={applicationsData?.content ?? []}
			/>

			<AuditLogsTable
				data={data}
				isLoading={isLoading}
				page={page ?? 0}
				onPageChange={(nextPage) =>
					updateSearch({
						page: nextPage,
					})
				}
			/>
		</div>
	);
}
