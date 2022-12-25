import dotenv from "dotenv";
import type { EnvConfig } from "../types/config";

export let config: EnvConfig = {
	DISCORD_CLIENT_ID: "",
	DISCORD_CLIENT_SECRET: "",
	DISCORD_OAUTH_URL: "",
	PORT: "2334",
	DISCORD_API_URL: "",
	JWT_SECRET: "",
	JWT_EXPIRES: "3d",
	MONGODB_URI: "",
	REDIS_URI: ""
}

export function initConfig() {
	config = (dotenv.config().parsed) as unknown as EnvConfig;
}

export function getPort() {
	return parseInt(config.PORT);
}

export function getDiscordOAuthRedirectURI() {
	const url = new URL(config.DISCORD_OAUTH_URL);
	return url.searchParams.get("redirect_uri");
}

export function getMongoDBDatabase() {
	const url = new URL(config.MONGODB_URI);
	return url.searchParams.get("authSource");
}