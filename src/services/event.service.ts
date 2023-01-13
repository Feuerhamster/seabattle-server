import { IEventMessage, IReceiverOptions } from "../types/sse";
import Redis from "ioredis";
import { config } from "./config.service.js";
import { encode, decode } from "@msgpack/msgpack";

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
function recieve(options: IReceiverOptions): () => void {
	function internalHandler (pattern: string, channel: string, message: Buffer) {
		const data = decode(message) as IEventMessage;

		if (!options.events.includes(data.event)) return;
		if (options.identifier !== data.to) return;

		options.handler(data);
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
	await pub.publish(pubsubkey + message.event, Buffer.from(encode(message)));

	return true;
}

export default {
	send, recieve
}