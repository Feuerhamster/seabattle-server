import { GameModes } from "../../gamemodes/index.js";
import { CoordinatePair, GamePhase, IGameState, IGameStatePlayer } from "../../types/game.js";
import uniqid from "uniqid";
import StoreService, * as Store from "../../services/store.service.js";
import { plainToInstance } from "class-transformer"
import { createGrid } from "../../utils/grid.utils.js";

export default class GameStateModel {
	state: IGameState;

	constructor(gamemode: GameModes, playerIds: string[], gridSize: CoordinatePair) {
		let playerStates: IGameStatePlayer[] = playerIds.map((playerId) => ({
			playerId,
			ships: [],
			grid: createGrid(gridSize.x, gridSize.y)
		}));
	
		this.state = {
			id: uniqid(),
			gamemode,
			createdDate: new Date(),
			playerStates,
			phase: GamePhase.Preperation,
			playersTurn: 0
		}
	}

	public async save() {
		await StoreService.key("games", this.state.id).setValueObject(this.state);
	}

	public static async load(id: string) {
		const state = await StoreService.key("games", id).getValueObject<IGameState>();
		return plainToInstance(GameStateModel, { state });
	}
}