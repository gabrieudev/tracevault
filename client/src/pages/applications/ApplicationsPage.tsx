import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { ApplicationsFilterBar } from "./components/ApplicationsFilterBar";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { CreateApplicationDialog } from "./components/CreateApplicationDialog";
import { useApplications } from "./use-applications";
import type { ApplicationSearch } from "@/routes/_app.applications.index";

const SEARCH_DEBOUNCE_MS = 400;

export function ApplicationsPage() {
	const { search, status, page } = useSearch({
		from: "/_app/applications/",
	});

	const navigate = useNavigate({
		from: "/applications/",
	});

	const [searchInput, setSearchInput] = useState(search ?? "");

	const { data, isLoading } = useApplications({
		search,
		status: status && status !== "ALL" ? [status] : undefined,
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
					search={searchInput}
					status={status ?? "ALL"}
					onSearchChange={setSearchInput}
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
