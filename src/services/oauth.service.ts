import axios, { AxiosResponse } from "axios";
import { IDiscordOAuthTokenResponse, IDiscordUser } from "../types/discord.js";
import { config, getDiscordOAuthRedirectURI } from "./config.service.js";
import path from "path";
import jwt from "jsonwebtoken";

export async function exchangeCode(code: string): Promise<string|null> {
	const data = {
		"client_id": config.DISCORD_CLIENT_ID,
		"client_secret": config.DISCORD_CLIENT_SECRET,
		"grant_type": "authorization_code",
		"code": code,
		"redirect_uri": getDiscordOAuthRedirectURI()
	  }
	const headers = {
		"Content-Type": "application/x-www-form-urlencoded",
		"Accept-Encoding": "gzip,deflate,compress"
	}

	let res: AxiosResponse<IDiscordOAuthTokenResponse>;

	try {
		res = await axios.post(path.join(config.DISCORD_API_URL, "/oauth2/token"), data, { headers });
	} catch(e) {
		return null;
	}

	return res.data.access_token;
}

export async function fetchUserData(accessToken: string): Promise<IDiscordUser|null> {
	let res: AxiosResponse<IDiscordUser>;

	try {
		res = await axios.get(path.join(config.DISCORD_API_URL, "/users/@me"), { headers: { "Authorization": "Bearer " + accessToken, "Accept-Encoding": "gzip,deflate,compress" } });
	} catch(e) {
		return null;
	}

	return res.data;
}

export async function discordFlow(code: string): Promise<IDiscordUser|null> {

	const accessToken = await exchangeCode(code);

	if (!accessToken) return null;

	const user = await fetchUserData(accessToken as string);

	if (!user) return null;

	return user as IDiscordUser;
}

export function getDiscordAvatarURL(userId: string, avatar: string): string {
	return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=256x256`;
}

export function createJWT(userId: string) {
	return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
}