<!-- MovingCircle.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let animationFrame: number;

    const MAX_SPEED = 10;
    const DECELERATION_RATE = 0.999;

	interface Circle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		color: string;
        transitionStartTime: number;
        colorProgress: number;
	}

    function hslToRgb(h: number, s: number, l: number): string {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;

        if (h < 60) {
        r = c;
        g = x;
        b = 0;
        } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
        } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
        } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
        } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
        } else {
        r = c;
        g = 0;
        b = x;
        }

        return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
    }

	function randomColor(): string {
        const h = Math.random() * 360;
        const s = 1;
        const l = 0.5;
        return hslToRgb(h, s, l);
	}

	function createCircle(x: number, y: number): Circle {
		return {
			x,
			y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
			radius: Math.random() * 20 + 10,
            color: '255, 255, 255',
            transitionStartTime: 0,
            colorProgress: 0,
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

        // Clamp the velocity within the maximum speed
        const speed = Math.sqrt(circle.vx * circle.vx + circle.vy * circle.vy);
        if (speed > MAX_SPEED) {
            circle.vx = (circle.vx / speed) * MAX_SPEED;
            circle.vy = (circle.vy / speed) * MAX_SPEED;
        }

        // Apply deceleration
        circle.vx *= DECELERATION_RATE;
        circle.vy *= DECELERATION_RATE;

		handleMouseover(circle, distance);
	}

	function handleMouseover(circle: Circle, distance: number): void {
        if (distance < circle.radius && circle.color === '255, 255, 255') {
            circle.color = randomColor();
            circle.transitionStartTime = performance.now();

            setTimeout(() => {
                circle.color = '255, 255, 255';
                circle.transitionStartTime = performance.now();
            }, 3000);
        }
    }

	function drawCircle(circle: Circle): void {
        const originalColor = '255, 255, 255';
        const [r1, g1, b1] = circle.color.split(', ').map(Number);
        const [r2, g2, b2] = originalColor.split(', ').map(Number);

        const r = r1 * (1 - circle.colorProgress) + r2 * circle.colorProgress;
        const g = g1 * (1 - circle.colorProgress) + g2 * circle.colorProgress;
        const b = b1 * (1 - circle.colorProgress) + b2 * circle.colorProgress;
        const interpolatedColor = `${r}, ${g}, ${b}`;

        if(!context) return;

        const gradient = context.createRadialGradient(circle.x, circle.y, circle.radius/2*1.5, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, `rgba(${interpolatedColor}, 0)`);
        gradient.addColorStop(1, `rgba(${interpolatedColor}, 0.8)`);

        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        context.fillStyle = gradient;
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

        for (const circle of circles) {
            const timeSinceTransition = (timestamp - circle.transitionStartTime) / 1000;
            circle.colorProgress = Math.min(timeSinceTransition / 3, 1);

            const otherCircles = circles.filter(c => c !== circle);
            
            for (const otherCircle of otherCircles) {
                const dx = circle.x - otherCircle.x;
                const dy = circle.y - otherCircle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = circle.radius + otherCircle.radius;

                if (distance < minDistance && circle.color !== '255, 255, 255') {
                    handleMouseover(otherCircle, distance); 
                }
            }
        }
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
