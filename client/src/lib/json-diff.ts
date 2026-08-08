export interface DiffLine {
	type: "added" | "removed" | "unchanged";
	content: string;
	oldLineNumber?: number;
	newLineNumber?: number;
}

function sortKeysDeep(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sortKeysDeep);
	if (value !== null && typeof value === "object") {
		return Object.keys(value as Record<string, unknown>)
			.sort()
			.reduce<Record<string, unknown>>((acc, key) => {
				acc[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
				return acc;
			}, {});
	}
	return value;
}

function stableStringify(value: unknown): string {
	return JSON.stringify(sortKeysDeep(value), null, 2);
}

export function diffJson(oldValue: unknown, newValue: unknown): DiffLine[] {
	const oldLines = oldValue === undefined || oldValue === null ? [] : stableStringify(oldValue).split("\n");
	const newLines = newValue === undefined || newValue === null ? [] : stableStringify(newValue).split("\n");

	const m = oldLines.length;
	const n = newLines.length;
	const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

	for (let i = m - 1; i >= 0; i--) {
		for (let j = n - 1; j >= 0; j--) {
			lcs[i][j] = oldLines[i] === newLines[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
		}
	}

	const result: DiffLine[] = [];
	let i = 0;
	let j = 0;
	let oldLineNumber = 1;
	let newLineNumber = 1;

	while (i < m && j < n) {
		if (oldLines[i] === newLines[j]) {
			result.push({ type: "unchanged", content: oldLines[i], oldLineNumber, newLineNumber });
			i++;
			j++;
			oldLineNumber++;
			newLineNumber++;
		} else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
			result.push({ type: "removed", content: oldLines[i], oldLineNumber });
			i++;
			oldLineNumber++;
		} else {
			result.push({ type: "added", content: newLines[j], newLineNumber });
			j++;
			newLineNumber++;
		}
	}
	while (i < m) {
		result.push({ type: "removed", content: oldLines[i], oldLineNumber });
		i++;
		oldLineNumber++;
	}
	while (j < n) {
		result.push({ type: "added", content: newLines[j], newLineNumber });
		j++;
		newLineNumber++;
	}

	return result;
}
