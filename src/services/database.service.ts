import MongoDB from "mongodb";
import { EOAuthProvider, IPlayerAccount } from "../models/database/playerAccount.model.js";
import { IDiscordUser } from "../types/discord.js";
import { config, getMongoDBDatabase } from "./config.service.js";

export let client: MongoDB.MongoClient;

let db: MongoDB.Db;

export async function connect() {
	client = new MongoDB.MongoClient( config.MONGODB_URI, { tls: false } );
	await client.connect();

	db = client.db(getMongoDBDatabase() ?? "seabattle");

	console.log("[mongodb] Successful connected");
}

/**
 * Get player by provider id
 * @param id providerId
 */
export async function getPlayerAccountByProviderId(providerId: string, provider: EOAuthProvider): Promise<IPlayerAccount<"out">|null> {
	return await db
		.collection<IPlayerAccount<"in">>("playerAccounts")
		.findOne({ providerId, provider }) as unknown as IPlayerAccount<"out">;
}

/**
 * Get player by id
 * @param id providerId
 */
export async function getPlayerAccountById(id: string): Promise<IPlayerAccount<"out">|null> {
	return await db
		.collection<IPlayerAccount<"in">>("playerAccounts")
		.findOne({ _id: new MongoDB.ObjectId(id) }) as unknown as IPlayerAccount<"out">;
}

export async function createPlayerAccount(provider: EOAuthProvider, providerId: string, username: string, discriminator: string, avatar: string) {
	let account: IPlayerAccount<"in"> = {
		provider,
		providerId,
		username,
		discriminator,
		avatar,
		registerDate: new Date(),
		xp: 0
	}

	await db
		.collection<IPlayerAccount<"in">>("playerAccounts")
		.insertOne(account);
	
	return account;
}