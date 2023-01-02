import { GameModes, getGamemode } from "../gamemodes";
import { GamePhase, IGameState } from "../types/game";
import * as StoreService from "./store.service";
import uniqid from "uniqid";
import eventService from "./event.service";
import { GameEvents } from "../types/sse";


export async function join(playerId: string, gamemode: GameModes) {
	await Promise.all([
		StoreService.pushQueue(["matchmaking", gamemode], playerId),
		StoreService.setValueString(["player", playerId, "matchmaking", "gamemode"], gamemode)
	]);
}

export async function leave(playerId: string, gamemode: GameModes) {
	await Promise.all([
		StoreService.removeQueue(["matchmaking", gamemode], playerId),
		StoreService.removeKey(["player", playerId, "matchmaking", "gamemode"])
	]);
}

export async function removeFromQueue(playerId: string) {
	const gamemode = await StoreService.getValueString(["player", playerId, "matchmaking", "gamemode"]);

	if (!gamemode) return;

	await Promise.all([
		StoreService.removeQueue(["matchmaking", gamemode], playerId),
		StoreService.removeKey(["player", playerId, "matchmaking", "gamemode"])
	]);
}

export async function matchmaking(gamemode: GameModes) {
	const game = getGamemode(gamemode);

	const queueLength = await StoreService.lengthQueue(["matchmaking", gamemode]);

	if (queueLength < game.forPlayers) {
		return;
	}

	const playerIds = await StoreService.shiftQueue(["matchmaking", gamemode], game.forPlayers);

	if(!playerIds) return;

	const grid: number[][] = new Array<number[]>(game.gridSize.y).fill(new Array<number>(game.gridSize.x).fill(0));

	const state: IGameState = {
		id: uniqid(),
		gamemode,
		phase: GamePhase.Preperation,
		createdDate: new Date(),
		playerStates: playerIds.map((playerId) => ({
			playerId,
			ships: [],
			grid: grid
		})),
		playersTurn: 0
	};

	await StoreService.setValue(["games", state.id], state);

	playerIds.forEach((playerId) => {
		StoreService.removeKey(["player", playerId, "matchmaking", "gamemode"]);

		eventService.send({
			to: playerId,
			from: null,
			event: GameEvents.MatchFound,
			data: state.id
		});
	});
}