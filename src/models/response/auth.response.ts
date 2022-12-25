import { IDiscordUser } from "../../types/discord";

export interface IAuthReponse {
	token: string;
	user: IDiscordUser;
}