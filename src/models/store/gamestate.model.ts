import { GameModes } from "../../gamemodes";
import { CoordinatePair, GamePhase, IGameState, IGameStatePlayer } from "../../types/game";
import uniqid from "uniqid";
import * as Store from "../../services/store.service";
import { plainToInstance } from "class-transformer"
import { createGrid } from "../../utils/grid.utils";

export default class GameState implements IGameState {
	public id: string;
	public gamemode: GameModes;
	public phase: GamePhase = GamePhase.Preperation;

	public createdDate: Date;
	public startedDate?: Date;
	public endedDate?: Date;

	public playerStates: IGameStatePlayer[] = [];
	public playersTurn = 0;

	constructor(gamemode: GameModes, playerIds: string[], gridSize: CoordinatePair) {
		this.id = uniqid();
		this.gamemode = gamemode;

		this.playerStates = playerIds.map((playerId) => ({
			playerId,
			ships: [],
			grid: createGrid(gridSize.x, gridSize.y)
		}));
		
		this.createdDate = new Date();
	}

	public async save() {
		await Store.setValue(["games", this.id], this);
	}

	public static async load(id: string): Promise<GameState> {
		const state = await Store.getValue(["games", id]);
		return plainToInstance(GameState, state);
	}
}