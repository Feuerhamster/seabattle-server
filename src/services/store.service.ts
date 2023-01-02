import Redis from "ioredis";
import { config } from "./config.service.js";
import { encode, decode } from "@msgpack/msgpack";

const redis = new Redis(config.REDIS_URI);

const namespace = "seabattle";

// Key Value Cache

export async function setValue(key: string[], value: object) {
	await redis.set(toPath(key), Buffer.from(encode(value)));
}

export async function setValueString(key: string[], value: string) {
	await redis.set(toPath(key), value);
}

export async function getValue<T extends object>(key: string[]) {
	const data = await redis.getBuffer(toPath(key));

	if (!data) return null;

	return decode(data) as T;
}

export async function getValueString(key: string[]) {
	const data = await redis.get(toPath(key));

	if (!data) return null;

	return data as string;
}

export async function hasKey(key: string[]) {
	return await redis.exists(toPath(key));
}

export async function removeKey(key: string[]) {
	await redis.del(toPath(key));
}

// Queues (aka. redis lists)

/**
 * Add a value to the end of the queue
 * @param key name of the queue
 * @param value value
 */
export async function pushQueue(key: string[], value: string) {
	await redis.rpush(toPath(key), value);
}


/**
 * Removes and returns the first element of the queue
 * @param key name of the queue
 * @returns the element
 */
export async function shiftQueue(key: string[], count: number) {
	return await redis.lpop(toPath(key), count);
}

/**
 * Returns the length of the queue
 * @param key name of the queue
 * @returns length
 */
export async function lengthQueue(key: string[]) {
	return await redis.llen(toPath(key))
}

export async function removeQueue(key: string[], value: string) {
	await redis.lrem(toPath(key), 0, value);
}

// Utils

function toPath(chunks: string[]): string {
	return [namespace, ...chunks].join(":");
}