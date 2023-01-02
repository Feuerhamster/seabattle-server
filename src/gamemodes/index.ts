import { IGameMode } from "../types/game";

import ClassicGamemode from "./classic.gamemode";

export enum GameModes {
	Classic = "classic"
}

export function getGamemode(gamemode: GameModes): IGameMode {
	switch(gamemode) {
		case GameModes.Classic: {
			return new ClassicGamemode();
		}
	}
}