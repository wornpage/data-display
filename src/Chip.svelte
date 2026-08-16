<script lang="ts">
	interface Props {
		label: string;
		count?: number;
		href?: string;
		pressed?: boolean;
		size?: 'sm' | 'md';
		variant?: 'default' | 'danger';
		class?: string;
		title?: string;
		'data-action'?: string;
		'data-pack'?: string;
		onclick?: (event: MouseEvent) => void;
		ondragover?: (event: DragEvent) => void;
		ondragleave?: (event: DragEvent) => void;
		ondrop?: (event: DragEvent) => void;
		children?: any;
	}

	let {
		label,
		count,
		href,
		pressed,
		size = 'md',
		variant = 'default',
		title,
		onclick,
		children,
		class: extraClass = '',
		...rest
	}: Props = $props();

	const classes = $derived(`worn-chip ${extraClass}`);
</script>

{#if href}
	<a
		class={classes}
		class:is-sm={size === 'sm'}
		class:is-danger={variant === 'danger' && !pressed}
		{href}
		{title}
		{...rest}
	>
		<span class="worn-chip-label">{label}</span>
		{#if count !== undefined}
			<span class="worn-chip-count">{count}</span>
		{/if}
		{@render children?.()}
	</a>
{:else if onclick}
	<button
		type="button"
		class={classes}
		class:is-sm={size === 'sm'}
		class:is-danger={variant === 'danger' && !pressed}
		aria-pressed={pressed}
		{title}
		{...rest}
		{onclick}
	>
		<span class="worn-chip-label">{label}</span>
		{#if count !== undefined}
			<span class="worn-chip-count">{count}</span>
		{/if}
		{@render children?.()}
	</button>
{:else}
	<span
		class={classes}
		class:is-sm={size === 'sm'}
		class:is-danger={variant === 'danger' && !pressed}
		data-pressed={pressed ? '' : undefined}
		{title}
		{...rest}
	>
		<span class="worn-chip-label">{label}</span>
		{#if count !== undefined}
			<span class="worn-chip-count">{count}</span>
		{/if}
		{@render children?.()}
	</span>
{/if}

<style>
	.worn-chip {
		align-items: center;
		background: var(--cockpit-surface, #fdfbf7);
		border: 1px solid var(--cockpit-border, #d0cac1);
		border-radius: 999px;
		box-sizing: border-box;
		color: var(--cockpit-text-muted, #506058);
		display: inline-flex;
		font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
		font-size: 13px;
		font-weight: 560;
		gap: 6px;
		line-height: 1.2;
		max-inline-size: 100%;
		min-inline-size: 0;
		padding: 6px 14px;
		transition: background-color 0.12s ease, color 0.12s ease;
	}

	.worn-chip-label {
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	button.worn-chip,
	a.worn-chip {
		cursor: pointer;
		min-height: 44px;
		touch-action: manipulation;
		user-select: none;
	}

	a.worn-chip { text-decoration: none; }

	.worn-chip[aria-pressed='true'],
	.worn-chip[data-pressed] {
		background: var(--cockpit-accent, #0f766e);
		border-color: var(--cockpit-accent, #0f766e);
		color: var(--cockpit-accent-text, #fff);
	}

	.worn-chip.is-sm {
		font-size: 12px;
		padding: 2px 10px;
	}

	button.worn-chip:hover:not([aria-pressed='true']),
	a.worn-chip:hover {
		background: var(--cockpit-accent-50, #e1f3ee);
		color: var(--cockpit-text, #21322b);
	}

	.worn-chip:focus-visible {
		outline: 2px dashed var(--worn-chip-focus, var(--cockpit-text, #21322b));
		outline-offset: 2px;
	}

	.worn-chip-count {
		background: var(--cockpit-bg, #f5f0e8);
		border: 1px solid var(--cockpit-border, #d0cac1);
		border-radius: 999px;
		flex-shrink: 0;
		font-size: 11px;
		font-weight: 600;
		line-height: 1.5;
		min-inline-size: 20px;
		padding: 0 7px;
		text-align: center;
	}

	.worn-chip[aria-pressed='true'] .worn-chip-count,
	.worn-chip[data-pressed] .worn-chip-count {
		background: var(--cockpit-bg, #f5f0e8);
		border-color: var(--cockpit-border, #d0cac1);
		color: var(--cockpit-text, #21322b);
	}

	.worn-chip.is-danger {
		border-color: var(--cockpit-danger-border, #b42318);
	}

	.worn-chip.is-danger .worn-chip-count {
		background: var(--cockpit-danger-bg, #fce8e7);
		border-color: var(--cockpit-danger-border, #b42318);
		color: var(--cockpit-danger-text, #7a1a14);
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-chip { transition: none; }
	}
</style>
