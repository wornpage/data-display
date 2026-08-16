export interface TimelineEntry {
	iter?: number | string;
	date?: string;
	title: string;
	description?: string;
	href?: string;
	meta?: string;
}

export type TimelineHeadingLevel = 2 | 3 | 4 | 5 | 6;
export type TimelineDateFormatter = (value: string) => string;

function parseDateOnly(value: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const parsed = new Date(year, month - 1, day);
	return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
		? parsed
		: null;
}

export function formatTimelineDate(value: string): string {
	const source = String(value ?? '').trim().slice(0, 40);
	const date = parseDateOnly(source);
	return date
		? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
		: source;
}
