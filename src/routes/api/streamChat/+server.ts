import type { RequestHandler } from './$types';
import { streamChat } from '$lib/server/openai/streamChat';

export const POST = (async ({ request }) => {
	const { message }: { message: string } = await request.json();

	const stream = new ReadableStream({
		async start(controller) {
			try {
				const reply = streamChat(message);
				for await (const chunk of reply) {
					controller.enqueue(chunk);
				}
			} catch (error) {
				controller.error();
			}
			return () => {
				console.log('controller closed');
			};
		},
		cancel() {
			console.log('cancelled');
		}
	});
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache'
		}
	});
}) satisfies RequestHandler;
