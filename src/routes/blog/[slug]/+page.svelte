<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h2>BlogPage</h2>

{#if data}
	<div class="card p-3 m-3">
		<header class="card-header">
			<h3>
				{data.title}
			</h3>
		</header>
		<section class="p-4">{@html data.body}</section>
	</div>
{:else}
	<div>No data.</div>
{/if}
