<script lang="ts">
	let inputMessage = '';

	let responseFromStreamChat = '';

	const readStream = async () => {
		const response = await fetch('/api/streamChat', {
			method: 'POST',
			headers: {
				'content-type': 'text/event-stream'
			},
			body: JSON.stringify({ message: inputMessage })
		});

		if (!response.body) throw new Error('No body');

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let done = false;
		while (!done) {
			const { done: readDone, value } = await reader.read();
			if (readDone) {
				done = readDone;
				reader.releaseLock();
			}
			responseFromStreamChat += decoder.decode(value);
		}
	};
</script>

<h2>Stream Chat</h2>

<div class="card p-4 mt-4">
	<label class="label">
		<input class="input" name="input" type="text" placeholder="Input" bind:value={inputMessage} />
	</label>
	<button type="submit" class="btn variant-filled mt-4" on:click={readStream}>Post</button>
	{#if responseFromStreamChat}
		<div class="card p-4 mt-4 variant-ghost-success">{responseFromStreamChat}</div>
	{/if}
</div>
