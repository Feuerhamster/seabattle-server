import { RequestBody } from "../request";

export interface ICoordinates {
	x: number;
	y: number;
}

export interface GameAction extends RequestBody {
	playerId: string;
	targets: ICoordinates[];
	gamemodeData: any;
}