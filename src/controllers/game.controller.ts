import { Controller, Get } from "@overnightjs/core";
import { IRequest, IResponse } from "express";
import GameStateModel from "../models/store/gamestate.model.js";
import type { IGameState } from "../types/game";

@Controller("games")
export default class GameController {
	@Get(":id")
	async getPlayer(req: IRequest<{}, {}, {id: string}>, res: IResponse<IGameState>) {
		let game = await GameStateModel.load(req.params.id);

		if (!game) return res.error!("not_found");

		res.send(game.state);
	}
}