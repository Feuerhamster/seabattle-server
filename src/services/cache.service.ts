import Redis from "ioredis";
import { config } from "./config.service.js";

const redis = new Redis(config.REDIS_URI);

const keyprefix = "seabattle.";

async function set(key: string, value: object) {
	await redis.set(keyprefix + key, JSON.stringify(value));
}

async function get(key: string) {
	const data = await redis.get(keyprefix + key);

	if (!data) return null;

	return JSON.parse(data);
}

async function has(key: string) {
	return await redis.exists(keyprefix + key);
}

function toPath(...args: string[]): string {
	return args.join(".");
}

export default {
	set, get, has, toPath
}