import { GameEvents } from "../types/sse.js";

/**
 * util to format sse messages
 * @param event event name
 * @param data event data
 * @param id optional event id
 * @returns formatted string
 */
export function formatSSE(event: GameEvents, data?: any, id?: number) {
	let str = "";

	if (id) str += `id: ${id}\n`;

	str += `event: ${event}\n`;
	str += `data: ${JSON.stringify(data)}`;

	str += `\n\n`;

	return str;
}