<script lang="ts">
	interface Props {
		value?: number;
		max?: number;
		label?: string;
		ariaLabel?: string;
		size?: 'sm' | 'md';
		variant?: 'default' | 'accent' | 'muted' | 'warn' | 'danger';
	}

	let {
		value = 0,
		max = 100,
		label,
		ariaLabel,
		size = 'md',
		variant = 'default'
	}: Props = $props();

	const safeMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);
	const safeValue = $derived(Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0);
	const pct = $derived((safeValue / safeMax) * 100);
</script>

	<div
	class="worn-progress"
	class:is-sm={size === 'sm'}
	class:is-accent={variant === 'accent'}
	class:is-muted={variant === 'muted'}
	class:is-warn={variant === 'warn'}
	class:is-danger={variant === 'danger'}
	role="progressbar"
	aria-valuenow={safeValue}
	aria-valuemin={0}
	aria-valuemax={safeMax}
	aria-label={ariaLabel || label || `${Math.round(pct)}%`}
>
	<svg class="worn-progress-track" aria-hidden="true" focusable="false">
		<rect class="worn-progress-fill" width={`${pct}%`} height="100%"></rect>
	</svg>
	{#if label}
		<span class="worn-progress-label">{label} — {Math.round(pct)}%</span>
	{/if}
</div>

<style>
	.worn-progress {
		--_worn-progress-default-fill: var(--worn-focus, var(--worn-text, #21322b));
		box-sizing: border-box;
		display: grid;
		gap: 4px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-progress-track {
		display: block;
		inline-size: 100%;
		background: var(--worn-progress-track, var(--worn-border, #d8d2c8));
		border-radius: 4px;
		height: 8px;
		overflow: hidden;
	}

	.worn-progress.is-sm .worn-progress-track {
		border-radius: 2px;
		height: 4px;
	}

	.worn-progress-fill {
		fill: var(--_worn-progress-active-fill, var(--worn-progress-fill, var(--_worn-progress-default-fill)));
		transition: width 0.4s ease;
	}

	.worn-progress.is-accent { --_worn-progress-active-fill: var(--worn-progress-accent-fill, var(--worn-progress-fill, var(--_worn-progress-default-fill))); }
	.worn-progress.is-muted { --_worn-progress-active-fill: var(--worn-progress-muted-fill, var(--worn-text-muted, #506058)); }
	.worn-progress.is-warn { --_worn-progress-active-fill: var(--worn-progress-warn-fill, var(--worn-warning-text, #a85200)); }
	.worn-progress.is-danger { --_worn-progress-active-fill: var(--worn-progress-danger-fill, var(--worn-danger-text, #991b1b)); }

	@supports (color: color-mix(in srgb, black, white)) {
		.worn-progress {
			--_worn-progress-default-fill: color-mix(in srgb, var(--worn-accent, #0f766e) 55%, var(--worn-text, #21322b));
		}
	}

	.worn-progress-label {
		color: var(--worn-text-muted);
		font-family: var(--font-typewriter);
		font-size: 11px;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-progress-fill { transition: none; }
	}
</style>
