import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { AlertsFilterBar } from "./components/AlertsFilterBar";
import { AlertsTable } from "./components/AlertsTable";
import { CreateAlertDialog } from "./components/CreateAlertDialog";
import { useAlerts } from "./use-alerts";
import { useApplicationsForFilter } from "./use-applications-for-filter";
import type { AlertsSearch } from "@/routes/_app.alerts.index";

const SEARCH_DEBOUNCE_MS = 400;

export function AlertsPage() {
	const { search, applicationId, channelType, minSeverity, active, page } = useSearch({
		from: "/_app/alerts/",
	});

	const navigate = useNavigate({
		from: "/alerts/",
	});

	const [searchInput, setSearchInput] = useState(search ?? "");

	const { data: applicationsData } = useApplicationsForFilter();

	const { data, isLoading } = useAlerts({
		search,
		applicationId,
		channelType,
		minSeverity,
		active,
		page,
		size: 10,
		sort: ["createdAt,desc"],
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

	function updateSearch(patch: Partial<AlertsSearch>) {
		navigate({
			search: (prev) => ({
				...prev,
				...patch,
			}),
		});
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
				<AlertsFilterBar
					filters={{ search, applicationId, channelType, minSeverity, active, page }}
					searchInput={searchInput}
					onSearchInputChange={setSearchInput}
					onFilterChange={(patch) => updateSearch({ ...patch, page: 0 })}
					applications={applicationsData?.content ?? []}
				/>

				<div className="mt-4">
					<CreateAlertDialog />
				</div>
			</div>

			<AlertsTable
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
