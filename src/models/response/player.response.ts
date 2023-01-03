import { IPlayerAccount } from "../database/playerAccount.model";

export interface IPublicPlayer {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
	level: number;
}