export enum GameModes {
	Classic = "classic"
}

export interface IGameState {
	id: string;
	gamemode: GameModes;
	playerStates: IGameStatePlayer[]
}

export interface IGameStatePlayer {
	ships: IGameStateShip[];
	grid: number[][];
	gamemodeData: any;
}

export interface IGameStateShip {
	x: number;
	y: number;
	direction: GameStateDirection;
	length: number;
	type: string;
	state: number[];
}

export enum GameStateDirection {
	None = 0,
	Vertical = 1,
	Horizonal = 2
}