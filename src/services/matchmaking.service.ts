import { GameModes, getGamemode } from "../gamemodes/index.js";
import StoreService from "./store.service.js";
import eventService from "./event.service.js";
import { GameEvents } from "../types/sse.js";
import GameState from "../models/store/gamestate.model.js";

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

	const gameState = new GameState(gamemode, playerIds, game.gridSize);
	await gameState.save();

	playerIds.forEach((playerId: string) => {
		StoreService.key("player", playerId, "matchmaking", "gamemode").delete();

		eventService.send({
			to: playerId,
			from: null,
			event: GameEvents.MatchFound,
			data: gameState.state.id
		});
	});
}