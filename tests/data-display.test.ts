import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const avatar = read('Avatar');
const badge = read('Badge');
const chip = read('Chip');
const progress = read('Progress');

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
		expect(pkg.version).toBe('0.1.0');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
	});

	it('exports and compiles all four component surfaces', async () => {
		const mod = await import('../src/index.ts');
		for (const name of ['Avatar', 'Badge', 'Chip', 'Progress']) expect(mod[name]).toBeDefined();
		for (const [name, source] of Object.entries({ Avatar: avatar, Badge: badge, Chip: chip, Progress: progress })) {
			expect(() => compile(source, { filename: `${name}.svelte`, generate: 'client' })).not.toThrow();
		}
	});

	it('contains badges and implements a real compact size', () => {
		expect(badge).toContain("size?: 'sm' | 'md';");
		expect(badge).toContain("class:is-sm={size === 'sm'}");
		expect(badge).toContain('max-inline-size: 100%;');
		expect(badge).toContain('min-inline-size: 0;');
		expect(badge).toContain('overflow-wrap: anywhere;');
		expect(badge).toMatch(/\.worn-badge\.is-sm \{[\s\S]*?font-size: 10px;[\s\S]*?padding: 1px 7px;/u);
	});

	it('keeps chips semantic, bounded, touch-safe, and motion-safe', () => {
		expect(chip).toContain('{#if onclick}');
		expect(chip).toContain('aria-pressed={pressed}');
		expect(chip).toContain('data-pressed={pressed ? \'\' : undefined}');
		expect(chip).toContain('max-inline-size: 100%;');
		expect(chip).toContain('min-height: 44px;');
		expect(chip).toContain('touch-action: manipulation;');
		expect(chip).toContain('@media (prefers-reduced-motion: reduce)');
		expect(chip).toContain('.worn-chip { transition: none; }');
	});

	it('falls back from broken avatar images before or after hydration without a duplicate accessible name', () => {
		expect(avatar).toContain("const showImage = $derived(Boolean(src) && failedSrc !== src);");
		expect(avatar).toContain("import { onMount } from 'svelte';");
		expect(avatar).toContain('bind:this={imageElement}');
		expect(avatar).toContain('if (imageElement?.complete && imageElement.naturalWidth === 0) handleImageError();');
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
		expect(progress).toContain('const bucket = $derived(Math.round(pct / 5) * 5);');
	});

	it('contains progress labels and stops width motion when requested', () => {
		expect(progress).toContain('inline-size: 100%;');
		expect(progress).toContain('max-inline-size: 100%;');
		expect(progress).toContain('min-inline-size: 0;');
		expect(progress).toContain('overflow-wrap: anywhere;');
		expect(progress).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.worn-progress-fill \{ transition: none; \}\s*\}/u);
	});
});
