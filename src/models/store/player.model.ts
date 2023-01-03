import { plainToInstance } from "class-transformer";
import { getPlayerAccountById } from "../../services/database.service";
import { levelByTotal } from "../../services/leveling.service";
import StoreService from "../../services/store.service";
import { IPublicPlayer } from "../response/player.response";

export class PublicPlayer implements IPublicPlayer {
	private _id: string;

	get id() {
		return this._id;
	}
	
	username: string;
	discriminator: string;
	avatar: string;
	xp: number;

	get level() {
		return levelByTotal(this.xp);
	}

	constructor(id: string, username: string, discriminator: string, avatar: string, xp: number = 0) {
		this._id = id;
		this.username = username;
		this.discriminator = discriminator;
		this.avatar = avatar;
		this.xp = xp;
	}

	async saveToCache() {
		await StoreService.key("player", this._id).setValueObject(this);
	}

	private static async loadFromDatabase(id: string) {
		const player = await getPlayerAccountById(id);

		if (!player || !player?._id) return null;

		return new PublicPlayer(player._id, player.username, player.discriminator, player.avatar, player.xp);
	}

	private static async loadFromCache(id: string) {
		const player = await StoreService.key("player", id).getValueObject<PublicPlayer>();

		if (!player) return null;

		return plainToInstance(PublicPlayer, player);
	}

	static async load(id: string) {
		let player = await PublicPlayer.loadFromCache(id);

		if (!player) {
			const fromDB = await PublicPlayer.loadFromDatabase(id);

			if (!fromDB) return null;

			player = fromDB;
		}

		return player;
	}
}