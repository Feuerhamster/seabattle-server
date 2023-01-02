import { GameAction } from "../models/request/game.request";
import { IGameMode, IGameState } from "../types/game";

enum Ships {
	AircraftCarrier = "aircraft-carrier",
	Battleship = "battleship",
	DestroyerA = "destroyer-a",
	DestroyerB = "destroyer-b",
	Boat = "boat"
}

export default class ClassicGamemode implements IGameMode {
	public forPlayers = 2;

	public ships = [
		{ name: Ships.AircraftCarrier, length: 5 },
		{ name: Ships.Battleship, length: 4 },
		{ name: Ships.DestroyerA, length: 3 },
		{ name: Ships.DestroyerB, length: 3 },
		{ name: Ships.AircraftCarrier, length: 2 },
	];

	public gridSize = { x: 14, y: 10 };

	public checkWinner(state: IGameState) {
		return -1;
	}

	public compute(state: IGameState, action: GameAction) {
		return state;
	}
}