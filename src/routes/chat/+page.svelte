<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<h2>Chat</h2>

<div class="card p-4 mt-4">
	<form method="POST">
		<label class="label">
			<input class="input" name="input" type="text" placeholder="Input" />
		</label>
		<button type="submit" class="btn variant-filled mt-4">Post</button>
	</form>

	{#if form?.reply}
		<div class="card p-4 mt-4 variant-ghost-success">{form?.reply}</div>
	{/if}
</div>
