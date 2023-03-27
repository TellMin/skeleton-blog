<!-- MovingCircle.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let animationFrame: number;

	interface Circle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		color: string;
	}

	function randomColor(): string {
		return `hsl(${Math.random() * 360}, 100%, 50%)`;
	}

	function createCircle(x: number, y: number): Circle {
		return {
			x,
			y,
			vx: Math.random() * 2 - 1,
			vy: Math.random() * 2 - 1,
			radius: Math.random() * 20 + 10,
			color: 'white'
		};
	}

	function updateCircle(circle: Circle, deltaTime: number, mouseX: number, mouseY: number): void {
		circle.x += circle.vx * deltaTime;
		circle.y += circle.vy * deltaTime;

		// Reflect circles off the edges of the canvas
		if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
			circle.vx = -circle.vx;
		}
		if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
			circle.vy = -circle.vy;
		}

		// Repel circles away from each other
		for (const otherCircle of circles) {
			if (otherCircle === circle) continue;

			const dx = circle.x - otherCircle.x;
			const dy = circle.y - otherCircle.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const minDistance = circle.radius + otherCircle.radius;

			if (distance < minDistance) {
				const angle = Math.atan2(dy, dx);
				const force = (minDistance - distance) * 0.01;
				circle.vx += Math.cos(angle) * force;
				circle.vy += Math.sin(angle) * force;
			}
		}

		const dx = circle.x - mouseX;
		const dy = circle.y - mouseY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const minDistance = circle.radius + 50;

		if (distance < minDistance) {
			const angle = Math.atan2(dy, dx);
			const force = (minDistance - distance) * 0.01;
			circle.vx += Math.cos(angle) * force;
			circle.vy += Math.sin(angle) * force;
		}
		handleMouseover(circle, distance);
	}
	function handleMouseover(circle: Circle, distance: number): void {
		if (distance < circle.radius && circle.color === 'white') {
			circle.color = randomColor();
			setTimeout(() => {
				circle.color = 'white';
			}, 3000);
		}
	}

	function drawCircle(circle: Circle): void {
		const dx = circle.x - mouseX;
		const dy = circle.y - mouseY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < circle.radius && circle.color === 'white') {
			circle.color = randomColor();
			setTimeout(() => {
				circle.color = 'white';
			}, 3000);
		}

		if (!context) return;

		context.beginPath();
		context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
		context.fillStyle = circle.color;
		context.fill();
	}

	let circles: Circle[] = [];
	let mouseX = -1000;
	let mouseY = -1000;

	function gameLoop(timestamp: number): void {
		const deltaTime = Math.min(0.1, timestamp / 1000);
		context?.clearRect(0, 0, canvas.width, canvas.height);

		for (const circle of circles) {
			updateCircle(circle, deltaTime, mouseX, mouseY);
			drawCircle(circle);
		}

		animationFrame = requestAnimationFrame(gameLoop);
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		context = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		for (let i = 0; i < 100; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height;
			circles.push(createCircle(x, y));
		}

		animationFrame = requestAnimationFrame(gameLoop);
		window.addEventListener('mousemove', handleMousemove);
		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('mousemove', handleMousemove);
		};
	});

	function handleMousemove(event: MouseEvent): void {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
</script>

<canvas bind:this={canvas} on:mousemove={handleMousemove} />

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
