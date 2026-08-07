import { useNavigate, useSearch } from "@tanstack/react-router";

import { ApplicationsFilterBar } from "./components/ApplicationsFilterBar";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { CreateApplicationDialog } from "./components/CreateApplicationDialog";
import { useApplications } from "./use-applications";
import type { ApplicationSearch } from "@/routes/_app.applications.index";

export function ApplicationsPage() {
	const { search, status, page } = useSearch({
		from: "/_app/applications/",
	});

	const navigate = useNavigate({
		from: "/applications/",
	});

	const { data, isLoading } = useApplications({
		search,
		status: status && status !== "ALL" ? [status] : undefined,
		page,
		size: 10,
		sort: ["createdAt,desc"],
	});

	function updateSearch(patch: Partial<ApplicationSearch>) {
		navigate({
			search: (prev) => ({
				...prev,
				...patch,
			}),
		});
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<ApplicationsFilterBar
					search={search ?? ""}
					status={status ?? "ALL"}
					onSearchChange={(value) =>
						updateSearch({
							search: value || undefined,
							page: 0,
						})
					}
					onStatusChange={(value) =>
						updateSearch({
							status: value === "ALL" ? undefined : value,
							page: 0,
						})
					}
				/>

				<CreateApplicationDialog />
			</div>

			<ApplicationsTable
				data={data}
				isLoading={isLoading}
				page={page}
				onPageChange={(nextPage) =>
					updateSearch({
						page: nextPage,
					})
				}
			/>
		</div>
	);
}
