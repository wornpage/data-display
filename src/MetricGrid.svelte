<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLUListElement> {
		ariaLabel: string;
		mobileColumns?: 1 | 2;
		children?: Snippet;
	}

	let {
		ariaLabel,
		mobileColumns = 1,
		children,
		class: extraClass = '',
		...rest
	}: Props = $props();
</script>

<ul
	class="worn-metric-grid {extraClass}"
	class:is-mobile-two={mobileColumns === 2}
	aria-label={ariaLabel}
	{...rest}
>
	{@render children?.()}
</ul>

<style>
	.worn-metric-grid {
		box-sizing: border-box;
		contain: inline-size;
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 10.5rem), 1fr));
		inline-size: 100%;
		list-style: none;
		margin: 0 0 20px;
		max-inline-size: 100%;
		min-inline-size: 0;
		padding: 0;
	}

	@media (max-width: 420px) {
		.worn-metric-grid { grid-template-columns: minmax(0, 1fr); }
		.worn-metric-grid.is-mobile-two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
</style>
