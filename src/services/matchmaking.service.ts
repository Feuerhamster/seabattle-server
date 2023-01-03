import { GameModes, getGamemode } from "../gamemodes";
import * as Store from "./store.service";
import eventService from "./event.service";
import { GameEvents } from "../types/sse";
import GameState from "../models/store/gamestate.model";

export async function join(playerId: string, gamemode: GameModes) {
	await Promise.all([
		Store.pushQueue(["matchmaking", gamemode], playerId),
		Store.setValueString(["player", playerId, "matchmaking", "gamemode"], gamemode)
	]);
}

export async function leave(playerId: string, gamemode: GameModes) {
	await Promise.all([
		Store.removeQueue(["matchmaking", gamemode], playerId),
		Store.removeKey(["player", playerId, "matchmaking", "gamemode"])
	]);
}

export async function removeFromQueue(playerId: string) {
	const gamemode = await Store.getValueString(["player", playerId, "matchmaking", "gamemode"]);

	if (!gamemode) return;

	await Promise.all([
		Store.removeQueue(["matchmaking", gamemode], playerId),
		Store.removeKey(["player", playerId, "matchmaking", "gamemode"])
	]);
}

export async function matchmaking(gamemode: GameModes) {
	const game = getGamemode(gamemode);

	const queueLength = await Store.lengthQueue(["matchmaking", gamemode]);

	if (queueLength < game.forPlayers) {
		return;
	}

	const playerIds = await Store.shiftQueue(["matchmaking", gamemode], game.forPlayers);

	if(!playerIds) return;

	const state = new GameState(gamemode, playerIds, game.gridSize);
	await state.save();

	playerIds.forEach((playerId) => {
		Store.removeKey(["player", playerId, "matchmaking", "gamemode"]);

		eventService.send({
			to: playerId,
			from: null,
			event: GameEvents.MatchFound,
			data: state.id
		});
	});
}