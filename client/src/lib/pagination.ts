export type PaginationItem = { type: "page"; value: number; key: string } | { type: "ellipsis"; key: string };

export function getPaginationPages(currentPage: number, totalPages: number): PaginationItem[] {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, index) => ({
			type: "page",
			value: index,
			key: `page-${index}`,
		}));
	}
	if (currentPage <= 2) {
		return [
			{ type: "page", value: 0, key: "page-0" },
			{ type: "page", value: 1, key: "page-1" },
			{ type: "page", value: 2, key: "page-2" },
			{ type: "ellipsis", key: "ellipsis-end" },
			{ type: "page", value: totalPages - 1, key: `page-${totalPages - 1}` },
		];
	}
	if (currentPage >= totalPages - 3) {
		return [
			{ type: "page", value: 0, key: "page-0" },
			{ type: "ellipsis", key: "ellipsis-start" },
			{ type: "page", value: totalPages - 3, key: `page-${totalPages - 3}` },
			{ type: "page", value: totalPages - 2, key: `page-${totalPages - 2}` },
			{ type: "page", value: totalPages - 1, key: `page-${totalPages - 1}` },
		];
	}
	return [
		{ type: "page", value: 0, key: "page-0" },
		{ type: "ellipsis", key: "ellipsis-start" },
		{ type: "page", value: currentPage, key: `page-${currentPage}` },
		{ type: "ellipsis", key: "ellipsis-end" },
		{ type: "page", value: totalPages - 1, key: `page-${totalPages - 1}` },
	];
}
