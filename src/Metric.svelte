<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLLIElement> {
		value: string | number;
		label: string;
		description?: string;
		tone?: 'default' | 'success' | 'warning';
		children?: Snippet;
	}

	let {
		value,
		label,
		description,
		tone = 'default',
		children,
		class: extraClass = '',
		...rest
	}: Props = $props();
</script>

<li
	class="worn-metric {extraClass}"
	class:is-success={tone === 'success'}
	class:is-warning={tone === 'warning'}
	{...rest}
>
	<span class="worn-metric-label">{label}</span>
	<strong class="worn-metric-value">{value}</strong>
	{#if description}<span class="worn-metric-description">{description}</span>{/if}
	{#if children}<div class="worn-metric-detail">{@render children()}</div>{/if}
</li>

<style>
	.worn-metric {
		background: var(--worn-surface, #fdfbf7);
		border: 1px solid var(--worn-border, #d4cec5);
		border-radius: 6px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		padding: 14px 16px;
	}

	.worn-metric.is-success { border-color: var(--worn-success-border, #4f8065); }
	.worn-metric.is-warning { border-color: var(--worn-warning-border, #b88721); }

	.worn-metric-label {
		color: var(--worn-text-secondary, #3d5148);
		font-size: 13px;
		font-weight: 600;
		line-height: 1.35;
		min-inline-size: 0;
	}

	.worn-metric-value {
		color: var(--worn-text, #26352f);
		font-size: 28px;
		font-variant-numeric: tabular-nums;
		font-weight: 650;
		line-height: 1.1;
		min-inline-size: 0;
	}

	.worn-metric-description {
		color: var(--worn-text-muted, #506058);
		font-size: 13px;
		font-weight: 450;
		line-height: 1.4;
		min-inline-size: 0;
	}

	.worn-metric-detail {
		margin-block-start: 6px;
		max-inline-size: 100%;
		min-inline-size: 0;
	}
</style>
