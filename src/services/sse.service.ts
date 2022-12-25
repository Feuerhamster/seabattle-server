import { SSECallback, GameEvents, IEventMessage } from "../types/sse";
import Redis from "ioredis";
import { config } from "./config.service.js";

const pub = new Redis(config.REDIS_URI);
const sub = new Redis(config.REDIS_URI);

pub.on("error", (err) => console.error("[redis] error:", err));
pub.on("connect", () => console.log("[redis] publisher connected"));

sub.on("error", (err) => console.error("[redis] error:", err));
sub.on("connect", () => console.log("[redis] subscriber connected"));

const pubsubkey = "seabattle.";

sub.psubscribe(pubsubkey + "*");

/**
 * Event handler for recieving server sent events
 * @param identifier Identifier to recieve from
 * @param handler Function that get executed on recieved events
 * @returns Function to stop recieving
 */
function recieve(event: GameEvents, identifier: string, handler: SSECallback): () => void {
	function internalHandler (pattern: string, channel: string, message: string) {
		const data: IEventMessage = JSON.parse(message);

		if (event !== data.event) return;
		if (identifier !== data.to) return;

		handler(data);
	}

	sub.on("pmessage", internalHandler);

	return () => {
		sub.off("pmessage", internalHandler);
	}
}

/**
 * Emitter to send a server sent event
 * @param to Identifier to send to
 * @param from Identifier of who sent the event
 * @param event event name
 * @param data event data
 * @returns succes status
 */
async function send(message: IEventMessage): Promise<boolean> {
	await pub.publish(pubsubkey + message.event, JSON.stringify(message));

	return true;
}

/**
 * util to format sse messages
 * @param event event name
 * @param data event data
 * @param id optional event id
 * @returns formatted string
 */
function format(event: GameEvents, data?: any, id?: number) {
	let str = "";

	if (id) str += `id: ${id}\n`;

	str += `event: ${event}\n`;
	str += `data: ${JSON.stringify(data)}`;

	str += `\n\n`;

	return str;
}

export default {
	send, recieve, format
}