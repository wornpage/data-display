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
		background: var(--worn-bg-secondary, #efede7);
		border: 1px solid transparent;
		border-radius: 999px;
		box-sizing: border-box;
		color: var(--worn-text, #21322b);
		display: inline-flex;
		font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
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
		background: var(--worn-warning-bg, #fff7ed);
		border-color: var(--worn-warning-border, #9a6b00);
		color: var(--worn-warning-text, #5f4300);
	}

	.worn-badge.is-accent {
		background: var(--worn-accent, #0f766e);
		color: var(--worn-accent-text, #fff);
	}

	.worn-badge.is-muted {
		background: var(--worn-bg-secondary, #efede7);
		color: var(--worn-text-muted, #506058);
	}
</style>
