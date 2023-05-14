<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<h2>Chat</h2>

<form method="POST">
	<label>
		Input
		<input name="input" type="text" />
	</label>
	<button>Post</button>
</form>

<h3>{form?.reply}</h3>
