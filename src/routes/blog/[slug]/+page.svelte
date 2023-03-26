<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h2>BlogPage</h2>

{#if data}
	<div class="card p-3">
		<div>{data.title}</div>
		<div>{data.body}</div>
	</div>
{:else}
	<div>No data.</div>
{/if}
