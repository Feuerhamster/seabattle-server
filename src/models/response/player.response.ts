import { IPlayerAccount } from "../database/playerAccount.model";

export interface PublicPlayer {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
	level: number;
}