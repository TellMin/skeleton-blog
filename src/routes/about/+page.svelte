<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<h2>Card</h2>

<p class="text-primary-500">Use card component</p>

<div class="pt-4">
	<div class="card p-4">
		<header class="card-header flex flex-row pl-0 pt-0">
			<Icon icon="ic:baseline-android" class="text-3xl text-primary-500" />
			<h2 class="pl-2">Header</h2>
		</header>
		<section class="card-body">
			<div class="container h-full mx-auto flex justify-start items-center">
				<p class="text-primary-500">Let's get cracking bones!</p>
			</div>
		</section>
	</div>
</div>
