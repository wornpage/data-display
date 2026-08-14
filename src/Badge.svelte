<script lang="ts">
	interface Props {
		label: string;
		variant?: 'default' | 'warn' | 'accent' | 'muted';
		size?: 'sm' | 'md';
		class?: string;
		title?: string;
		[key: string]: unknown;
	}

	let {
		label,
		variant = 'default',
		size = 'md',
		class: extraClass = '',
		title,
		...rest
	}: Props = $props();
</script>

<span
	class="worn-badge {extraClass}"
	class:is-sm={size === 'sm'}
	class:is-warn={variant === 'warn'}
	class:is-accent={variant === 'accent'}
	class:is-muted={variant === 'muted'}
	{title}
	{...rest}
>
	<span class="worn-badge-label">{label}</span>
</span>

<style>
	.worn-badge {
		align-items: center;
		background: var(--cockpit-bg-secondary);
		border: 1px solid transparent;
		border-radius: 999px;
		box-sizing: border-box;
		color: var(--cockpit-text);
		display: inline-flex;
		font-family: var(--font-typewriter);
		font-size: 11px;
		font-weight: 600;
		justify-content: center;
		letter-spacing: 0;
		line-height: 1.3;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		padding: 2px 10px;
		text-align: center;
	}

	.worn-badge-label {
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-badge.is-sm {
		font-size: 10px;
		padding: 1px 7px;
	}

	.worn-badge.is-warn {
		background: var(--cockpit-warning-bg);
		border-color: var(--cockpit-warning-border);
		color: var(--cockpit-warning-text);
	}

	.worn-badge.is-accent {
		background: var(--cockpit-accent);
		color: var(--cockpit-accent-text);
	}

	.worn-badge.is-muted {
		background: var(--cockpit-border);
		color: var(--cockpit-text-muted);
	}
</style>
