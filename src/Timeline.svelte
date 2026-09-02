<script lang="ts">
	import type { Snippet } from 'svelte';
	import Badge from './Badge.svelte';
	import { assertSafeHref } from './safe-href';
	import {
		formatTimelineDate,
		type TimelineDateFormatter,
		type TimelineEntry,
		type TimelineHeadingLevel
	} from './timeline';

	interface Props {
		/** Timeline rows in display order. */
		entries: TimelineEntry[];
		/** Badge prefix, for example "#" renders "#12". */
		badgePrefix?: string;
		/** Accessible name for the ordered list. */
		ariaLabel?: string;
		/** Heading rank used for entry titles. */
		headingLevel?: TimelineHeadingLevel;
		/** Row density. Compact keeps operational timelines scannable. */
		density?: 'default' | 'compact';
		/** Optional date display formatter. The datetime value remains normalized ISO input. */
		formatDate?: TimelineDateFormatter;
		/** Optional structured title renderer. The string title remains the accessible fallback. */
		titleContent?: Snippet<[TimelineEntry, number]>;
		class?: string;
		[key: string]: unknown;
	}

	let {
		entries,
		badgePrefix = '#',
		ariaLabel = 'Release history',
		headingLevel = 2,
		density = 'default',
		formatDate = formatTimelineDate,
		titleContent,
		class: extraClass = '',
		...rest
	}: Props = $props();

	const safeEntries = $derived(Array.isArray(entries) ? entries : []);
	const safeHeadingLevel = $derived(
		[2, 3, 4, 5, 6].includes(Number(headingLevel)) ? Number(headingLevel) : 2
	);
	const headingTag = $derived(`h${safeHeadingLevel}`);

	function cleanText(value: unknown): string {
		return typeof value === 'string' ? value.trim() : '';
	}

	function cleanDate(value: unknown): string {
		return cleanText(value).slice(0, 40);
	}

	function iterationText(value: unknown): string {
		if (typeof value === 'number' && Number.isFinite(value)) return String(value);
		return cleanText(value).slice(0, 24);
	}

	function entryLabel(iteration: string, title: string): string {
		if (!iteration) return title;
		return title ? `Iteration ${iteration}: ${title}` : `Iteration ${iteration}`;
	}
</script>

<ol class="worn-timeline {extraClass}" class:is-compact={density === 'compact'} aria-label={ariaLabel} {...rest}>
	{#each safeEntries as entry, i}
		{@const iteration = iterationText(entry?.iter)}
		{@const date = cleanDate(entry?.date)}
		{@const title = cleanText(entry?.title)}
		{@const description = cleanText(entry?.description)}
		{@const href = entry?.href === undefined ? undefined : assertSafeHref(entry.href)}
		{@const meta = cleanText(entry?.meta)}
		<li class="worn-timeline-entry">
			<div class="worn-timeline-marker" aria-hidden="true">
				<span class="worn-timeline-dot" class:worn-timeline-dot-latest={i === 0}></span>
				{#if i < safeEntries.length - 1}<span class="worn-timeline-line"></span>{/if}
			</div>
			<svelte:element
				this={href ? 'a' : 'article'}
				class="worn-timeline-card"
				class:worn-timeline-card-link={Boolean(href)}
				href={href}
				aria-label={entryLabel(iteration, title) || undefined}
			>
				{#if iteration || date}
					<div class="worn-timeline-meta">
						{#if iteration}<Badge variant="accent" label={`${badgePrefix}${iteration}`} />{/if}
						{#if date}<time datetime={date} class="worn-timeline-date">{formatDate(date)}</time>{/if}
					</div>
				{/if}
				{#if title}
					<svelte:element this={headingTag} class="worn-timeline-title">
						{#if titleContent}{@render titleContent(entry, i)}{:else}{title}{/if}
					</svelte:element>
				{/if}
				{#if description}<p class="worn-timeline-desc">{description}</p>{/if}
				{#if meta}<span class="worn-timeline-entry-meta">{meta}</span>{/if}
			</svelte:element>
		</li>
	{/each}
</ol>

<style>
	.worn-timeline {
		box-sizing: border-box;
		contain: inline-size;
		display: flex;
		flex-direction: column;
		inline-size: 100%;
		list-style: none;
		margin: 0;
		max-inline-size: var(--worn-timeline-max-inline-size, 40rem);
		min-inline-size: 0;
		padding: 0;
	}

	.worn-timeline-entry {
		box-sizing: border-box;
		display: flex;
		gap: 16px;
		max-inline-size: 100%;
		min-block-size: 60px;
		min-inline-size: 0;
	}

	.worn-timeline-marker {
		align-items: center;
		display: flex;
		flex: 0 0 16px;
		flex-direction: column;
		inline-size: 16px;
	}

	.worn-timeline-dot {
		background: var(--worn-border, #d4cec5);
		border: 2px solid var(--worn-border, #d4cec5);
		border-radius: 50%;
		box-sizing: border-box;
		block-size: 12px;
		flex: 0 0 12px;
		inline-size: 12px;
		margin-block-start: 6px;
	}

	.worn-timeline-dot-latest {
		background: var(--worn-accent, #23796d);
		border-color: var(--worn-accent, #23796d);
	}

	.worn-timeline-line {
		background: var(--worn-border, #d4cec5);
		flex: 1;
		inline-size: 2px;
		min-block-size: 8px;
	}

	.worn-timeline-card {
		box-sizing: border-box;
		color: var(--worn-text, #26352f);
		flex: 1 1 auto;
		font-family: var(--font-sans, system-ui, sans-serif);
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		padding: 4px 0 20px;
	}

	.worn-timeline-card-link {
		border-radius: var(--worn-radius-sm, 6px);
		min-block-size: 44px;
		text-decoration: none;
		touch-action: manipulation;
		transition: background-color 120ms ease, color 120ms ease;
	}

	.worn-timeline-card-link:hover {
		background: var(--worn-bg-secondary, #efede7);
	}

	.worn-timeline-card-link:focus-visible {
		outline: 2px solid var(--worn-timeline-focus, var(--worn-focus, var(--worn-text, currentColor)));
		outline-offset: 2px;
	}

	.worn-timeline.is-compact .worn-timeline-entry {
		gap: 12px;
		min-block-size: 44px;
	}

	.worn-timeline.is-compact .worn-timeline-card {
		column-gap: 8px;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		padding: 2px 4px 10px;
		row-gap: 3px;
	}

	.worn-timeline.is-compact .worn-timeline-meta {
		grid-column: 1;
		grid-row: 1;
		margin-block-end: 0;
	}

	.worn-timeline.is-compact .worn-timeline-title {
		font-size: 13px;
		grid-column: 2;
		grid-row: 1;
		margin: 0;
	}

	.worn-timeline.is-compact .worn-timeline-desc {
		font-size: 12px;
		grid-column: 1 / -1;
		grid-row: 2;
		line-height: 1.45;
	}

	.worn-timeline.is-compact .worn-timeline-entry-meta {
		font-size: 11px;
		grid-column: 1 / -1;
		grid-row: 3;
		margin-block-start: 0;
	}

	.worn-timeline-meta {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-block-end: 4px;
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	.worn-timeline-date {
		color: var(--worn-text-muted, #65746d);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-timeline-title {
		color: var(--worn-text, #26352f);
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0;
		margin: 0 0 4px;
		overflow-wrap: anywhere;
	}

	.worn-timeline-desc {
		color: var(--worn-text-secondary, #4e5f57);
		font-size: 13px;
		letter-spacing: 0;
		line-height: 1.55;
		margin: 0;
		overflow-wrap: anywhere;
	}

	.worn-timeline-entry-meta {
		color: var(--worn-text-muted, #65746d);
		display: block;
		font-size: 12px;
		margin-block-start: 4px;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	@media (max-width: 420px) {
		.worn-timeline-entry { gap: 12px; }
		.worn-timeline.is-compact .worn-timeline-title {
			grid-column: 1 / -1;
			grid-row: 2;
		}
		.worn-timeline.is-compact .worn-timeline-desc { grid-row: 3; }
		.worn-timeline.is-compact .worn-timeline-entry-meta { grid-row: 4; }
		.worn-timeline.is-compact .worn-timeline-title,
		.worn-timeline-desc {
			display: -webkit-box;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-timeline-card-link { transition: none; }
	}
</style>
