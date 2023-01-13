import { RequestBody } from "../request.js";

export interface ICoordinates {
	x: number;
	y: number;
}

export interface GameAction extends RequestBody {
	playerId: string;
	targets: ICoordinates[];
	gamemodeData: any;
}