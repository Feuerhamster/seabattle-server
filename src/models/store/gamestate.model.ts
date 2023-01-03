import { GameModes } from "../../gamemodes";
import { CoordinatePair, GamePhase, IGameState, IGameStatePlayer } from "../../types/game";
import uniqid from "uniqid";
import StoreService, * as Store from "../../services/store.service";
import { plainToInstance } from "class-transformer"
import { createGrid } from "../../utils/grid.utils";

export default class GameState implements IGameState {
	private _id: string;

	public get id() {
		return this._id;
	}

	public gamemode: GameModes;
	public phase: GamePhase = GamePhase.Preperation;

	public createdDate: Date;
	public startedDate?: Date;
	public endedDate?: Date;

	public playerStates: IGameStatePlayer[] = [];
	public playersTurn = 0;

	constructor(gamemode: GameModes, playerIds: string[], gridSize: CoordinatePair) {
		this._id = uniqid();
		this.gamemode = gamemode;

		this.playerStates = playerIds.map((playerId) => ({
			playerId,
			ships: [],
			grid: createGrid(gridSize.x, gridSize.y)
		}));
		
		this.createdDate = new Date();
	}

	public async save() {
		await StoreService.key("games", this.id).setValueObject(this);
	}

	public static async load(id: string): Promise<GameState> {
		const state = await StoreService.key("games", id).getValueObject<IGameState>();
		return plainToInstance(GameState, state);
	}
}