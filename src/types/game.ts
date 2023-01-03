import { GameModes } from "../gamemodes";
import { GameAction } from "../models/request/game.request";

export enum GamePhase {
	Preperation,
	Running,
	End
}

export interface CoordinatePair {
	x: number;
	y: number;
}

export interface IGameState {
	id: string;
	gamemode: GameModes;
	phase: GamePhase;
	createdDate: Date;
	startedDate?: Date;
	endedDate?: Date;
	playerStates: IGameStatePlayer[];
	playersTurn: number;
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

export interface IGameReport {
	id: string;
	playerId: string;
	enemies: string[];
	gamemode: GameModes;
	winner: boolean;
	shipCount: number;
	shipsDestroyed: number;
	shipsLost: number;
	createdDate: Date;
	startedDate: Date;
	endedDate: Date;
	totalTime: number;
	playTime: number;
	xpEarned: number;
}

export interface IGameMode {
	forPlayers: number;
	ships: { name: string; length: number }[];
	gridSize: CoordinatePair;
	compute: (state: IGameState, action: GameAction) => IGameState;
	checkWinner: (state: IGameState) => number;
}