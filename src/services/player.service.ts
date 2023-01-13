import { IPublicPlayer } from "../models/response/player.response.js";
import { getPlayerAccountById } from "./database.service.js";
import { levelByTotal } from "./leveling.service.js";

export async function getPlayer(id: string): Promise<IPublicPlayer | null> {

	const player = await getPlayerAccountById(id);

	if (!player) return null;

	return {
		id: player._id!.toString(),
		username: player.username,
		discriminator: player.discriminator,
		avatar: player.avatar,
		level: levelByTotal(player.xp)
	};

}