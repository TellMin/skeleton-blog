<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h2>Chat</h2>

<div>{data.body.item}</div>
