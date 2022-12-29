import Redis from "ioredis";
import { stringify, parse } from "zipson";
import { config } from "./config.service.js";

const redis = new Redis(config.REDIS_URI);

const namespace = "seabattle";

// Key Value Cache

async function set(key: string, value: object) {
	await redis.set(toPath(namespace, key), stringify(value));
}

async function get(key: string) {
	const data = await redis.get(namespace + key);

	if (!data) return null;

	return parse(data);
}

async function has(key: string) {
	return await redis.exists(namespace + key);
}

// Queues (aka. redis lists)

/**
 * Add a value to the end of the queue
 * @param key name of the queue
 * @param value value
 */
async function push(key: string, value: string) {
	await redis.rpush(toPath(namespace, key), value);
}


/**
 * Removes and returns the first element of the queue
 * @param key name of the queue
 * @returns the element
 */
async function shift(key: string) {
	return await redis.lpop(toPath(namespace, key));
}

/**
 * Returns the length of the queue
 * @param key name of the queue
 * @returns length
 */
async function len(key: string) {
	return await redis.llen(toPath(namespace, key))
}

async function rem(key: string, value: string) {
	await redis.lrem(toPath(namespace, key), 0, value);
}

// Utils

function toPath(...args: string[]): string {
	return args.join(":");
}

export default {
	set, get, has,
	queue: {
		push, shift, rem, len
	},
	toPath
}