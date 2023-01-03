import { GameModes, getGamemode } from "../gamemodes";
import StoreService from "./store.service";
import eventService from "./event.service";
import { GameEvents } from "../types/sse";
import GameState from "../models/store/gamestate.model";

export async function join(playerId: string, gamemode: GameModes) {
	await Promise.all([
		StoreService.queue("matchmaking", gamemode).push(playerId),
		StoreService.key("player", playerId, "matchmaking", "gamemode").setValueString(gamemode)
	]);
}

export async function leave(playerId: string, gamemode: GameModes) {
	await Promise.all([
		StoreService.queue("matchmaking", gamemode).remove(playerId),
		StoreService.key("player", playerId, "matchmaking", "gamemode").delete()
	]);
}

export async function removeFromQueue(playerId: string) {
	const gamemode = await StoreService.key("player", playerId, "matchmaking", "gamemode").getValueString();

	if (!gamemode) return;

	await Promise.all([
		StoreService.queue("matchmaking", gamemode).remove(playerId),
		StoreService.key("player", playerId, "matchmaking", "gamemode").delete()
	]);
}

export async function matchmaking(gamemode: GameModes) {
	const game = getGamemode(gamemode);

	const queueLength = await StoreService.queue("matchmaking", gamemode).length();

	if (queueLength < game.forPlayers) {
		return;
	}

	const playerIds = await StoreService.queue("matchmaking", gamemode).shift(game.forPlayers);

	if(!playerIds) return;

	const state = new GameState(gamemode, playerIds, game.gridSize);
	await state.save();

	playerIds.forEach((playerId: string) => {
		StoreService.key("player", playerId, "matchmaking", "gamemode").delete();

		eventService.send({
			to: playerId,
			from: null,
			event: GameEvents.MatchFound,
			data: state.id
		});
	});
}