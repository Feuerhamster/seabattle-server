import { IPlayerAccount } from "../database/playerAccount.model";

export interface PublicPlayer extends Pick < IPlayerAccount<"out">, "_id" | "username" | "avatar" | "discriminator" | "xp" | "registerDate"> {
	providerId?: never;
	provider?: never;
}