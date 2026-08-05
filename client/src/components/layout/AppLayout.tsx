import { Outlet, useMatches } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export interface AppRouteStaticData {
	title?: string;
	subtitle?: string;
}

export function AppLayout() {
	const matches = useMatches();
	const leaf = matches[matches.length - 1];
	const { title, subtitle } = (leaf?.staticData ?? {}) as AppRouteStaticData;

	return (
		<div className="flex min-h-screen bg-background text-foreground">
			<Sidebar />

			<div className="flex min-h-screen flex-1 flex-col">
				<MobileNav />
				<Header title={title ?? "Audit Trail"} subtitle={subtitle} />

				<main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
