<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h2>Blog</h2>

<p class="text-primary-500">These are My Posts.</p>

{#if data}
	{#each data.body.blogs as blog}
		<div class="card p-3">
			<a href="/blog/{blog.id}">{blog.title}</a>
			<div>{blog.createdAt}</div>
		</div>
	{/each}
{:else}
	<div>No data.</div>
{/if}
