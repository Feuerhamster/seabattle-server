import { Controller, Get, Middleware } from "@overnightjs/core";
import { IRequest, IResponse } from "express";
import { Post } from "@overnightjs/core";
import { config } from "../services/config.service.js";
import { SSEHandler } from "../middleware/sse.middleware.js";
import EventService from "../services/sse.service.js";
import authenticate from "../middleware/auth.middleware.js";
import { GameEvents } from "../types/sse.js";
import { StatusCode } from "../types/httpStatusCodes.js";

@Controller("matchmaking")
export default class DefaultController {
	@Post("queue")
	public joinMatchmakingQueue(req: IRequest, res: IResponse) {

	}

	@Post("challenge")
	public async challengeAnotherPlayer(req: IRequest<{}>, res: IResponse<string[]>) {
		await EventService.send({
			from: "moin",
			to: "test",
			event: GameEvents.MatchFound,
			data: { test: true }
		});
		res.status(StatusCode.OK).end();
	}

	@Get("events")
	//@Middleware(authenticate)
	@Middleware(SSEHandler)
	public handleQueueEvents(req: IRequest, res: IResponse) {

		const stop = EventService.recieve(GameEvents.MatchFound, "test", (data) => {
			console.log(data);
		});

		req.on("close", () => {
			stop();
		});
	}
}