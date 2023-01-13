import { Controller, Get } from "@overnightjs/core";
import { IRequest, IResponse } from "express";
import { IPublicPlayer } from "../models/response/player.response.js";
import { PublicPlayerModel } from "../models/store/player.model.js";

@Controller("players")
export default class GameController {
	@Get(":id")
	async getPlayer(req: IRequest<{}, {}, {id: string}>, res: IResponse<IPublicPlayer>) {
		let p = await PublicPlayerModel.load(req.params.id);

		if (!p) return res.error!("not_found");

		res.send(p.player);
	}
}