import { GameModes } from "../gamemodes";
import { GameAction } from "../models/request/game.request";

export enum GamePhase {
	Preperation,
	Running,
	End
}

export interface IGameState {
	id: string;
	gamemode: GameModes;
	phase: GamePhase;
	createdDate: Date;
	startedDate?: Date;
	endedDate?: Date;
	playerStates: IGameStatePlayer[];
	playersTurn: 0;
}

export interface IGameStatePlayer {
	playerId: string;
	ships: IGameStateShip[];
	grid: number[][];
	gamemodeData?: any;
}

export interface IGameStateShip {
	x: number;
	y: number;
	direction: GameStateDirection;
	length: number;
	name: string;
	state: number[];
}

export enum GameStateDirection {
	None = 0,
	Vertical = 1,
	Horizonal = 2
}

export interface IMidRoundGameStateForPlayer {
	id: string;
	gamemode: GameModes;
	phase: GamePhase;
	players: string[];
	state: IGameStatePlayer;
	playersTurn: number;
}

export interface IGameMode {
	forPlayers: number;
	ships: { name: string; length: number }[];
	gridSize: { x: number, y: number };
	compute: (state: IGameState, action: GameAction) => IGameState;
	checkWinner: (state: IGameState) => number;
}