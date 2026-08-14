<script lang="ts">
	interface Props {
		value?: number;
		max?: number;
		label?: string;
		size?: 'sm' | 'md';
		variant?: 'default' | 'accent' | 'warn' | 'danger';
	}

	let {
		value = 0,
		max = 100,
		label,
		size = 'md',
		variant = 'default'
	}: Props = $props();

	const safeMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);
	const safeValue = $derived(Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0);
	const pct = $derived((safeValue / safeMax) * 100);
	const bucket = $derived(Math.round(pct / 5) * 5);
</script>

<div
	class="worn-progress"
	class:is-sm={size === 'sm'}
	class:is-accent={variant === 'accent'}
	class:is-warn={variant === 'warn'}
	class:is-danger={variant === 'danger'}
	role="progressbar"
	aria-valuenow={safeValue}
	aria-valuemin={0}
	aria-valuemax={safeMax}
	aria-label={label || `${Math.round(pct)}%`}
>
	<div class="worn-progress-track">
		<div class="worn-progress-fill worn-progress-fill-{bucket}"></div>
	</div>
	{#if label}
		<span class="worn-progress-label">{label} — {Math.round(pct)}%</span>
	{/if}
</div>

<style>
	.worn-progress {
		box-sizing: border-box;
		display: grid;
		gap: 4px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-progress-track {
		background: var(--cockpit-border);
		border-radius: 4px;
		height: 8px;
		overflow: hidden;
	}

	.worn-progress.is-sm .worn-progress-track {
		border-radius: 2px;
		height: 4px;
	}

	.worn-progress-fill {
		background: var(--cockpit-accent);
		border-radius: inherit;
		height: 100%;
		min-inline-size: 0;
		transition: width 0.4s ease;
	}

	.worn-progress.is-accent .worn-progress-fill { background: var(--cockpit-accent); }
	.worn-progress.is-warn .worn-progress-fill { background: var(--cockpit-warning-text); }
	.worn-progress.is-danger .worn-progress-fill { background: var(--cockpit-danger-text); }

	.worn-progress-label {
		color: var(--cockpit-text-muted);
		font-family: var(--font-typewriter);
		font-size: 11px;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-progress-fill-0 { width: 0%; }
	.worn-progress-fill-5 { width: 5%; }
	.worn-progress-fill-10 { width: 10%; }
	.worn-progress-fill-15 { width: 15%; }
	.worn-progress-fill-20 { width: 20%; }
	.worn-progress-fill-25 { width: 25%; }
	.worn-progress-fill-30 { width: 30%; }
	.worn-progress-fill-35 { width: 35%; }
	.worn-progress-fill-40 { width: 40%; }
	.worn-progress-fill-45 { width: 45%; }
	.worn-progress-fill-50 { width: 50%; }
	.worn-progress-fill-55 { width: 55%; }
	.worn-progress-fill-60 { width: 60%; }
	.worn-progress-fill-65 { width: 65%; }
	.worn-progress-fill-70 { width: 70%; }
	.worn-progress-fill-75 { width: 75%; }
	.worn-progress-fill-80 { width: 80%; }
	.worn-progress-fill-85 { width: 85%; }
	.worn-progress-fill-90 { width: 90%; }
	.worn-progress-fill-95 { width: 95%; }
	.worn-progress-fill-100 { width: 100%; }

	@media (prefers-reduced-motion: reduce) {
		.worn-progress-fill { transition: none; }
	}
</style>
