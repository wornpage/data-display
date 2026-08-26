import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const avatar = read('Avatar');
const badge = read('Badge');
const chip = read('Chip');
const metric = read('Metric');
const metricGrid = read('MetricGrid');
const progress = read('Progress');
const timeline = read('Timeline');
const timelineContract = readFileSync(new URL('../src/timeline.ts', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

function relativeLuminance(hex: string) {
	const channels = hex.match(/[0-9a-f]{2}/giu)!.map((value) => Number.parseInt(value, 16) / 255);
	return channels
		.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
		.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

describe('@wornpage/data-display', () => {
	it('declares one source-delivered v2 package', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/data-display');
		expect(pkg.version).toBe('0.1.7');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
	});

	it('exports and compiles all seven component surfaces', async () => {
		const mod = await import('../src/index.ts');
		for (const name of ['Avatar', 'Badge', 'Chip', 'Metric', 'MetricGrid', 'Progress', 'Timeline']) expect(mod[name]).toBeDefined();
		for (const [name, source] of Object.entries({ Avatar: avatar, Badge: badge, Chip: chip, Metric: metric, MetricGrid: metricGrid, Progress: progress, Timeline: timeline })) {
			expect(() => compile(source, { filename: `${name}.svelte`, generate: 'client' })).not.toThrow();
		}
	});

	it('owns semantic metric lists and bounded dashboard values', () => {
		expect(metricGrid).toMatch(/<ul[\s\S]*?class="worn-metric-grid \{extraClass\}"[\s\S]*?aria-label=\{ariaLabel\}[\s\S]*?>/u);
		expect(metricGrid).toContain('{@render children?.()}');
		expect(metricGrid).toMatch(/grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 10\.5rem\), 1fr\)\);/u);
		expect(metric).toContain('<li');
		expect(metric).toContain('<span class="worn-metric-label">{label}</span>');
		expect(metric).toContain('<strong class="worn-metric-value">{value}</strong>');
		expect(metric).toContain('overflow-wrap: anywhere;');
		expect(metric).toContain('font-variant-numeric: tabular-nums;');
		expect(metric).toContain("tone?: 'default' | 'success' | 'warning';");
	});

	it('defaults MetricGrid to one mobile column and supports an explicit two-column opt-in', () => {
		expect(metricGrid).toContain('mobileColumns?: 1 | 2;');
		expect(metricGrid).toContain('mobileColumns = 1,');
		expect(metricGrid).toContain('class:is-mobile-two={mobileColumns === 2}');
		expect(metricGrid).toMatch(/@media \(max-width: 420px\) \{[\s\S]*?\.worn-metric-grid \{ grid-template-columns: minmax\(0, 1fr\); \}[\s\S]*?\.worn-metric-grid\.is-mobile-two \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}/u);
		expect(readme).toContain('| `mobileColumns` | `1 \\| 2` | `1` | Number of columns at viewport widths up to 420 px |');
		expect(readme).toContain('Set `mobileColumns={2}` when compact metrics should remain paired on narrow screens.');
	});

	it('contains badges and implements a real compact size', () => {
		expect(badge).toContain("size?: 'sm' | 'md';");
		expect(badge).toContain("class:is-sm={size === 'sm'}");
		expect(badge).toContain('max-inline-size: 100%;');
		expect(badge).toContain('min-inline-size: 0;');
		expect(badge).toContain('overflow-wrap: anywhere;');
		expect(badge).toMatch(/\.worn-badge\.is-sm \{[\s\S]*?font-size: 10px;[\s\S]*?padding: 1px 7px;/u);
	});

	it('keeps chip command and toggle semantics explicit', () => {
		expect(chip).toContain('{#if href}');
		expect(chip).toContain('{:else if onclick}');
		expect(chip).toContain('<a');
		expect(chip).toContain('{href}');
		expect(chip).toContain('\t\tpressed,');
		expect(chip).not.toContain('pressed = false');
		expect(chip).toContain('aria-pressed={pressed}');
		expect(chip).toContain('data-pressed={pressed ? \'\' : undefined}');
		expect(chip).toContain('dragOver?: boolean;');
		expect(chip).toContain('dragOver = false,');
		expect(chip.match(/class:is-drag-over=\{dragOver\}/gu)).toHaveLength(3);
	});

	it('keeps chips bounded, touch-safe, compact when static, and motion-safe', () => {
		const rootRule = chip.match(/\n\t\.worn-chip \{([\s\S]*?)\n\t\}/u)?.[1] ?? '';
		expect(chip).toContain('max-inline-size: 100%;');
		expect(chip).toMatch(/button\.worn-chip,\s*a\.worn-chip \{[\s\S]*?min-height: 44px;/u);
		expect(chip).toContain('a.worn-chip { text-decoration: none; }');
		expect(chip).toMatch(/@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?button\.worn-chip:hover:not\(\[aria-pressed='true'\]\),\s*a\.worn-chip:hover/u);
		expect(chip).not.toContain("\n\tbutton.worn-chip:hover:not([aria-pressed='true']),");
		expect(rootRule).not.toContain('min-height');
		expect(chip).toContain('touch-action: manipulation;');
		expect(chip).toContain('outline: 2px dashed var(--worn-chip-focus, var(--worn-text, #21322b));');
		expect(chip).toContain('@media (prefers-reduced-motion: reduce)');
		expect(chip).toContain('.worn-chip { transition: none; }');
		expect(chip).toContain('.worn-chip.is-drag-over {');
		expect(chip).toContain('box-shadow: 0 0 0 3px var(--worn-chip-drag-over-ring, #5eead4);');
		expect(chip).toContain('outline: 2px solid var(--worn-chip-drag-over-outline, #0f766e);');
		expect(chip).not.toMatch(/\.is-drag-over[\s\S]*?(?:transform|translate|scale|animation):/u);
	});

	it('keeps the complete chip label visible inside its bounded surface', () => {
		const rootRule = chip.match(/\n\t\.worn-chip \{([\s\S]*?)\n\t\}/u)?.[1] ?? '';
		const labelRule = chip.match(/\.worn-chip-label \{([\s\S]*?)\n\t\}/u)?.[1] ?? '';
		expect(rootRule).toContain('inline-size: max-content;');
		expect(labelRule).toContain('min-inline-size: 0;');
		expect(labelRule).toContain('overflow-wrap: anywhere;');
		expect(labelRule).toContain('white-space: normal;');
		expect(labelRule).not.toContain('overflow: hidden;');
		expect(labelRule).not.toContain('text-overflow: ellipsis;');
		expect(readme).toContain('Complete labels wrap within the Chip instead of being hidden behind an ellipsis.');
	});

	it('owns standalone-safe badge and chip theme fallbacks', () => {
		const mutedBadgeRule = badge.match(/\.worn-badge\.is-muted \{([\s\S]*?)\n\t\}/u)?.[1] ?? '';
		expect(badge).toContain('var(--worn-bg-secondary, #efede7)');
		expect(badge).toContain('var(--worn-warning-text, #5f4300)');
		expect(badge).toContain('var(--worn-accent-text, #fff)');
		expect(mutedBadgeRule).toContain('background: var(--worn-bg-secondary, #efede7);');
		expect(mutedBadgeRule).not.toContain('var(--worn-border');
		expect(chip).toContain('var(--worn-surface, #fdfbf7)');
		expect(chip).toContain('var(--worn-text-muted, #506058)');
		expect(chip).toContain('var(--worn-danger-text, #7a1a14)');
		const pairs = [
			['#21322b', '#efede7'],
			['#506058', '#efede7'],
			['#ffffff', '#0f766e'],
			['#5f4300', '#fff7ed'],
			['#506058', '#fdfbf7'],
			['#7a1a14', '#fce8e7']
		];
		for (const [foreground, background] of pairs) {
			const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
			const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
			expect((light + 0.05) / (dark + 0.05)).toBeGreaterThanOrEqual(4.5);
		}
		expect(readme).toContain('Muted badges pair `--worn-text-muted` with `--worn-bg-secondary`; override them together with colors that preserve small-text contrast.');
	});

	it('falls back from broken avatar images before or after hydration without a duplicate accessible name', () => {
		expect(avatar).toContain("const showImage = $derived(Boolean(src) && failedSrc !== src);");
		expect(avatar).toContain("import { onMount } from 'svelte';");
		expect(avatar).toContain('bind:this={imageElement}');
		expect(avatar).toContain('if (image.complete && image.naturalWidth === 0)');
		expect(avatar).toContain('void image.decode().catch(markFailed);');
		expect(avatar).toContain('onerror={handleImageError}');
		expect(avatar).toMatch(/<img[\s\S]*?alt=""[\s\S]*?aria-hidden="true"/u);
		expect(avatar).toContain('role="img"');
		expect(avatar).toContain('aria-label={`${identity}, ${status}`}');
	});

	it('keeps white avatar initials readable across the deterministic palette', () => {
		const backgrounds = [...avatar.matchAll(/\.worn-avatar-bg-(\d) \{ background: (#[0-9a-f]{6}); \}/giu)];
		expect(backgrounds).toHaveLength(8);
		for (const [, index, color] of backgrounds) {
			const contrast = 1.05 / (relativeLuminance(color) + 0.05);
			expect(contrast, `avatar ${index} contrast`).toBeGreaterThanOrEqual(4.5);
		}
	});

	it('normalizes progress values before visual and ARIA output', () => {
		expect(progress).toContain('const safeMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);');
		expect(progress).toContain('const safeValue = $derived(Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0);');
		expect(progress).toContain('aria-valuenow={safeValue}');
		expect(progress).toContain('aria-valuemax={safeMax}');
		expect(progress).toContain('aria-label={ariaLabel || label || `${Math.round(pct)}%`}');
		expect(progress).toContain("variant?: 'default' | 'accent' | 'muted' | 'warn' | 'danger';");
	});

	it('paints the exact safe percentage with a CSP-safe all-theme visual', () => {
		expect(progress).toContain('<svg class="worn-progress-track" aria-hidden="true" focusable="false">');
		expect(progress).toContain('<rect class="worn-progress-fill" width={`${pct}%`} height="100%"></rect>');
		expect(progress).not.toContain('const bucket = $derived');
		expect(progress).not.toMatch(/worn-progress-fill-\d/u);
		expect(progress).not.toContain('style:width');
		expect(progress).toContain('--_worn-progress-default-fill: var(--worn-focus, var(--worn-text, #21322b));');
		expect(progress).toContain('fill: var(--_worn-progress-active-fill, var(--worn-progress-fill, var(--_worn-progress-default-fill)));');
		expect(progress).toContain('color-mix(in srgb, var(--worn-accent, #0f766e) 55%, var(--worn-text, #21322b))');
		expect(progress).toContain('.worn-progress.is-muted { --_worn-progress-active-fill: var(--worn-progress-muted-fill, var(--worn-text-muted, #506058)); }');
		expect(progress).toContain('.worn-progress.is-warn { --_worn-progress-active-fill: var(--worn-progress-warn-fill, var(--worn-warning-text, #a85200)); }');
		expect(progress).toContain('.worn-progress.is-danger { --_worn-progress-active-fill: var(--worn-progress-danger-fill, var(--worn-danger-text, #991b1b)); }');
		expect(readme).toContain('exact clamped fraction without an inline style');
		expect(readme).toContain('`--worn-progress-fill`');
	});

	it('contains progress labels and stops width motion when requested', () => {
		expect(progress).toContain('inline-size: 100%;');
		expect(progress).toContain('max-inline-size: 100%;');
		expect(progress).toContain('min-inline-size: 0;');
		expect(progress).toContain('overflow-wrap: anywhere;');
		expect(progress).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.worn-progress-fill \{ transition: none; \}\s*\}/u);
	});

	it('uses native timeline semantics and hides only decorative tracks', () => {
		expect(timeline).toContain('<ol class="worn-timeline {extraClass}" class:is-compact={density === \'compact\'} aria-label={ariaLabel} {...rest}>');
		expect(timeline).toContain('<li class="worn-timeline-entry">');
		expect(timeline).toContain("this={href ? 'a' : 'article'}");
		expect(timeline).toContain('href={href || undefined}');
		expect(timeline).toContain('<time datetime={date} class="worn-timeline-date">');
		expect(timeline).toContain('<svelte:element this={headingTag} class="worn-timeline-title">');
		expect(timeline).toContain('class="worn-timeline-marker" aria-hidden="true"');
		expect(timeline).not.toContain('role="article"');
	});

	it('supports optional linked activity entries without synthetic iteration badges', () => {
		expect(timelineContract).toContain('iter?: number | string;');
		expect(timelineContract).toContain('date?: string;');
		expect(timelineContract).toContain('description?: string;');
		expect(timelineContract).toContain('href?: string;');
		expect(timelineContract).toContain('meta?: string;');
		expect(timeline).toContain("density?: 'default' | 'compact';");
		expect(timeline).toContain('{#if iteration}<Badge variant="accent" label={`${badgePrefix}${iteration}`} />{/if}');
		expect(timeline).toContain('{#if meta}<span class="worn-timeline-entry-meta">{meta}</span>{/if}');
		expect(timeline).toMatch(/\.worn-timeline-card-link \{[\s\S]*?min-block-size: 44px;[\s\S]*?touch-action: manipulation;/u);
		expect(timeline).toMatch(/\.worn-timeline-card-link:focus-visible \{[\s\S]*?outline-offset: 2px;/u);
		expect(timeline).toMatch(/@media \(max-width: 420px\) \{[\s\S]*?\.worn-timeline\.is-compact \.worn-timeline-title,[\s\S]*?\.worn-timeline-desc \{[\s\S]*?-webkit-line-clamp: 3;[\s\S]*?line-clamp: 3;/u);
		expect(timeline).toMatch(/@media \(max-width: 420px\) \{[\s\S]*?\.worn-timeline\.is-compact \.worn-timeline-title \{[\s\S]*?grid-column: 1 \/ -1;[\s\S]*?grid-row: 2;[\s\S]*?\.worn-timeline\.is-compact \.worn-timeline-desc \{ grid-row: 3; \}[\s\S]*?\.worn-timeline\.is-compact \.worn-timeline-entry-meta \{ grid-row: 4; \}/u);
		expect(timeline).toMatch(/\.worn-timeline\.is-compact \.worn-timeline-entry \{[\s\S]*?min-block-size: 44px;/u);
		expect(timeline).toMatch(/\.worn-timeline\.is-compact \.worn-timeline-card \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: auto minmax\(0, 1fr\);/u);
	});

	it('owns a theme-extensible focus ring for linked entries', () => {
		const focusRule = timeline.match(/\.worn-timeline-card-link:focus-visible \{[\s\S]*?\}/u)?.[0] ?? '';
		expect(focusRule).toContain('outline: 2px solid var(--worn-timeline-focus, var(--worn-focus, var(--worn-text, currentColor)));');
		expect(focusRule).not.toContain('--worn-accent');
		expect(readme).toContain('`--worn-timeline-focus`');
	});

	it('allows structured title content without changing the plain-title fallback', () => {
		expect(timeline).toContain("import type { Snippet } from 'svelte';");
		expect(timeline).toContain('titleContent?: Snippet<[TimelineEntry, number]>;');
		expect(timeline).toContain('{#if titleContent}{@render titleContent(entry, i)}{:else}{title}{/if}');
		expect(timeline).toContain('aria-label={entryLabel(iteration, title) || undefined}');
	});

	it('contains hostile timeline entries without relying on application styles', () => {
		expect(timeline).toMatch(/\.worn-timeline \{[\s\S]*?contain: inline-size;[\s\S]*?inline-size: 100%;[\s\S]*?min-inline-size: 0;/u);
		expect(timeline).toMatch(/\.worn-timeline-card \{[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?overflow-wrap: anywhere;/u);
		expect(timeline).toMatch(/\.worn-timeline-meta \{[\s\S]*?flex-wrap: wrap;[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;/u);
		expect(timeline).toMatch(/\.worn-timeline-date \{[\s\S]*?max-inline-size: 100%;[\s\S]*?overflow-wrap: anywhere;/u);
		expect(timeline).toMatch(/\.worn-timeline-title \{[\s\S]*?overflow-wrap: anywhere;/u);
		expect(timeline).toMatch(/\.worn-timeline-desc \{[\s\S]*?overflow-wrap: anywhere;/u);
		expect(timeline).toMatch(/\.worn-timeline-entry-meta \{[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?overflow-wrap: anywhere;/u);
		expect(timeline).toContain('max-inline-size: var(--worn-timeline-max-inline-size, 40rem);');
	});

	it('owns date formatting, theme fallbacks, and presentation-static rows', async () => {
		const { formatTimelineDate } = await import('../src/timeline.ts');
		expect(formatTimelineDate('2026-08-14')).toBe('Aug 14, 2026');
		expect(formatTimelineDate('not-a-date')).toBe('not-a-date');
		expect(formatTimelineDate('x'.repeat(80))).toHaveLength(40);
		expect(timeline).toContain('var(--worn-text, #26352f)');
		expect(timeline).toContain('var(--worn-border, #d4cec5)');
		expect(timeline).not.toMatch(/\banimation(?:-delay)?:|@keyframes/u);
		expect(timeline).toContain('.worn-timeline-card-link { transition: none; }');
	});
});
