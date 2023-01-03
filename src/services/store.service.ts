import Redis from "ioredis";
import { config } from "./config.service.js";
import { encode, decode } from "@msgpack/msgpack";

const redis = new Redis(config.REDIS_URI);

const namespace = "seabattle";


// Queues (aka. redis lists)

class QueueService {
	private key: string;

	constructor(keyParts: string[]) {
		this.key = toPath(keyParts);
	}

	/**
	 * Add a value to the end of the queue
	 * @param key name of the queue
	 * @param value value
	 */
	async push(value: string) {
		await redis.rpush(this.key, value);
	}


	/**
	 * Removes and returns the first element of the queue
	 * @param key name of the queue
	 * @returns the element
	 */
	async shift(count: number) {
		return await redis.lpop(this.key, count);
	}

	/**
	 * Returns the length of the queue
	 * @param key name of the queue
	 * @returns length
	 */
	async length() {
		return await redis.llen(this.key)
	}

	async remove(value: string) {
		await redis.lrem(this.key, 0, value);
	}

}

class KeyValueService {
	private key: string;

	constructor(keyParts: string[]) {
		this.key = toPath(keyParts);
	}

	async setValueObject(value: object) {
		await redis.set(this.key, Buffer.from(encode(value)));
	}
	
	async setValueString(value: string) {
		await redis.set(this.key, value);
	}

	async getValueObject<T extends object>() {
		const data = await redis.getBuffer(this.key);
	
		if (!data) return null;
	
		return decode(data) as T;
	}
	
	async getValueString() {
		const data = await redis.get(this.key);
	
		if (!data) return null;
	
		return data as string;
	}
	
	async exists() {
		return await redis.exists(this.key);
	}
	
	async delete() {
		await redis.del(this.key);
	}

}

export default class StoreService {
	static key(...parts: string[]) {
		return new KeyValueService(parts);
	}

	static queue(...keyParts: string[]) {
		return new QueueService(keyParts);
	}
}

// Utils

function toPath(chunks: string[]): string {
	return [namespace, ...chunks].join(":");
}