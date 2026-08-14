<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		name?: string;
		email?: string;
		src?: string;
		size?: 'sm' | 'md' | 'lg';
		status?: 'online' | 'away' | 'offline';
		class?: string;
	}

	let {
		name = '',
		email = '',
		src = '',
		size = 'md',
		status = 'offline',
		class: className = ''
	}: Props = $props();

	let failedSrc = $state('');
	let imageElement = $state<HTMLImageElement>();
	const identity = $derived(name || email || 'User');
	const showImage = $derived(Boolean(src) && failedSrc !== src);
	const initials = $derived(
		(name || email || '?')
			.split(/[\s@.]+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0].toUpperCase())
			.join('')
	);

	const AVATAR_BG_CLASSES = [
		'worn-avatar-bg-0', 'worn-avatar-bg-1', 'worn-avatar-bg-2', 'worn-avatar-bg-3',
		'worn-avatar-bg-4', 'worn-avatar-bg-5', 'worn-avatar-bg-6', 'worn-avatar-bg-7',
	] as const;

	const bgClass = $derived(
		AVATAR_BG_CLASSES[
			((name || email || '').split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0) >>> 0)
				% AVATAR_BG_CLASSES.length
		]
	);

	function handleImageError() {
		failedSrc = src;
	}

	onMount(() => {
		if (imageElement?.complete && imageElement.naturalWidth === 0) handleImageError();
	});
</script>

<span
	class={`worn-avatar worn-avatar-${size} ${className}`}
	class:is-online={status === 'online'}
	class:is-away={status === 'away'}
	class:is-offline={status === 'offline'}
	role="img"
	aria-label={`${identity}, ${status}`}
>
	{#if showImage}
		<img
			bind:this={imageElement}
			{src}
			alt=""
			aria-hidden="true"
			class="worn-avatar-img"
			draggable="false"
			onerror={handleImageError}
		/>
	{:else}
		<span class="worn-avatar-initials {bgClass}">{initials}</span>
	{/if}
	{#if status !== 'offline'}
		<span class="worn-avatar-dot" aria-hidden="true"></span>
	{/if}
</span>

<style>
	.worn-avatar {
		align-items: center;
		border-radius: 50%;
		display: inline-flex;
		flex-shrink: 0;
		font-weight: 600;
		justify-content: center;
		line-height: 1;
		overflow: hidden;
		position: relative;
		user-select: none;
	}

	.worn-avatar-sm { width: 20px; height: 20px; font-size: 9px; }
	.worn-avatar-md { width: 28px; height: 28px; font-size: 12px; }
	.worn-avatar-lg { width: 36px; height: 36px; font-size: 14px; }

	.worn-avatar-img,
	.worn-avatar-initials {
		border-radius: 50%;
		height: 100%;
		width: 100%;
	}

	.worn-avatar-img { object-fit: cover; }

	.worn-avatar-initials {
		align-items: center;
		color: #fff;
		display: flex;
		justify-content: center;
	}

	.worn-avatar-dot {
		background: #22c55e;
		border: 2px solid var(--cockpit-bg, #fff);
		border-radius: 50%;
		bottom: 0;
		height: 8px;
		position: absolute;
		right: 0;
		width: 8px;
	}

	.worn-avatar-sm .worn-avatar-dot { width: 6px; height: 6px; border-width: 1px; }

	.worn-avatar-bg-0 { background: #4338ca; }
	.worn-avatar-bg-1 { background: #be185d; }
	.worn-avatar-bg-2 { background: #c2410c; }
	.worn-avatar-bg-3 { background: #0f766e; }
	.worn-avatar-bg-4 { background: #7e22ce; }
	.worn-avatar-bg-5 { background: #0e7490; }
	.worn-avatar-bg-6 { background: #be123c; }
	.worn-avatar-bg-7 { background: #4d7c0f; }
	.is-away .worn-avatar-dot { background: #f59e0b; }
	.is-offline .worn-avatar-dot { background: #9ca3af; }
</style>
