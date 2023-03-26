<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-seafoam.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	const drawerOpen = () => drawerStore.open(drawerSettings);

	const drawerClose = () => drawerStore.close();

	const drawerSettings: DrawerSettings = {
		bgDrawer: 'drawer items-center',
		width: 'w-[280px]'
	};
</script>

<Drawer>
	<div class="p-4">
		<h1>Menu</h1>
		<ul class="list-nav p-4">
			<li>
				<a href="/" on:click={drawerClose}>
					<span class="flex-auto content-center">Home</span>
				</a>
			</li>
			<li>
				<a href="/about" on:click={drawerClose}>
					<span class="flex-auto content-center">About</span>
				</a>
			</li>
			<li>
				<a href="/blog" on:click={drawerClose}>
					<span class="flex-auto content-center">Blog</span>
				</a>
			</li>
		</ul>
	</div>

	<style>
		.drawer {
			background: linear-gradient(120deg, rgba(33, 50, 83, 1) 0%, rgba(8, 132, 124, 0.8) 100%);
		}
	</style>
</Drawer>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			background=""
			slotTrail="place-content-end"
		>
			<svelte:fragment slot="lead">
				<button on:click={drawerOpen}>
					<span><Icon icon="material-symbols:menu" class="text-secondary-50" /> </span>
				</button></svelte:fragment
			>
			<h1>TellMinZ</h1>
		</AppBar>
	</svelte:fragment>

	<div class="p-8">
		<slot />
	</div>
</AppShell>
