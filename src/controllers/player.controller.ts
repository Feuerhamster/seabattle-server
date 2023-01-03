import { Controller, Get } from "@overnightjs/core";
import { IRequest, IResponse } from "express";
import { PublicPlayer } from "../models/response/player.response";

@Controller("players")
export default class GameController {
	@Get(":id")
	async getPlayer(req: IRequest<{}, {}, {id: string}>, res: IResponse<PublicPlayer>) {

	}
}