import { plainToInstance } from "class-transformer";
import { getPlayerAccountById } from "../../services/database.service.js";
import { levelByTotal } from "../../services/leveling.service.js";
import StoreService from "../../services/store.service.js";
import { IPublicPlayer } from "../response/player.response.js";

export class PublicPlayerModel {
	player: IPublicPlayer;

	constructor(id: string, username: string, discriminator: string, avatar: string, xp: number = 0) {
		this.player = {
			id,
			username,
			discriminator,
			avatar,
			level: levelByTotal(xp)
		}
	}

	async save() {
		await StoreService.key("player", this.player.id).setValueObject(this);
	}

	private static async loadFromDatabase(id: string) {
		const player = await getPlayerAccountById(id);

		if (!player || !player?._id) return null;

		return new PublicPlayerModel(player._id.toString(), player.username, player.discriminator, player.avatar, player.xp);
	}

	private static async loadFromCache(id: string) {
		const player = await StoreService.key("player", id).getValueObject<PublicPlayerModel>();

		if (!player) return null;

		return plainToInstance(PublicPlayerModel, { player });
	}

	static async load(id: string) {
		let player = await PublicPlayerModel.loadFromCache(id);

		if (!player) {
			const fromDB = await PublicPlayerModel.loadFromDatabase(id);

			if (!fromDB) return null;

			await fromDB.save();

			player = fromDB;
		}

		return player;
	}
}