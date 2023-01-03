import { PublicPlayer } from "../models/response/player.response";
import { getPlayerAccountById } from "./database.service";


export async function getPlayer(id: string): Promise<PublicPlayer | null> {

	const player = await getPlayerAccountById(id);

	if (!player) return null;

	return {
		id: player._id as string,
		username: player.username,
		discriminator: player.discriminator,
		avatar: player.avatar,
		level: 0
	};

}