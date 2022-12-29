import { GameModes } from "../types/game";
import CacheService from "./cache.service";

export function join(playerId: string, gamemode: GameModes) {
	CacheService.queue.push(CacheService.toPath("matchmaking", gamemode), playerId);
}

export function leave(playerId: string, gamemode: GameModes) {
	CacheService.queue.rem(CacheService.toPath("matchmaking", gamemode), playerId);
}

export function leaveAll(playerId: string) {
	Object.values(GameModes).forEach((value) => {
		CacheService.queue.rem(CacheService.toPath("matchmaking", value), playerId);
	});
}