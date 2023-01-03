import { Controller, Get, Middleware } from "@overnightjs/core";
import { IRequest, IResponse } from "express";
import { Post } from "@overnightjs/core";
import { SSEHandler } from "../middlewares/sse.middleware.js";
import EventService from "../services/event.service.js";
import { GameEvents, SSECallback } from "../types/sse.js";
import { StatusCode } from "../types/httpStatusCodes.js";
import validate from "../middlewares/validation.middleware.js";
import { JoinMatchmaking } from "../models/request/matchmaking.request.js";
import { formatSSE } from "../utils/formatSSE.utils.js";
import * as MatchmakingService from "../services/matchmaking.service.js";

@Controller("matchmaking")
export default class MatchmakingController {
	@Post("queue")
	//@Middleware(authenticate)
	@Middleware(validate(JoinMatchmaking))
	public joinMatchmakingQueue(req: IRequest<JoinMatchmaking>, res: IResponse) {
		MatchmakingService.join(req.user!.id, req.body.gamemode);
		MatchmakingService.matchmaking(req.body.gamemode);
		res.status(StatusCode.OK).end();
	}

	@Post("cancel")
	//@Middleware(authenticate)
	@Middleware(validate(JoinMatchmaking))
	public leaveMatchmakingQueue(req: IRequest<JoinMatchmaking>, res: IResponse) {
		MatchmakingService.leave(req.user!.id, req.body.gamemode);
		res.status(StatusCode.OK).end();
	}

	/*@Post("challenge")
	//@Middleware(authenticate)
	@Middleware(validate(ChallengePlayer))
	public async challengeAnotherPlayer(req: IRequest<ChallengePlayer>, res: IResponse<string[]>) {
		await EventService.send({
			from: req.user!.id,
			to: req.body.playerId,
			event: GameEvents.Challenged
		});
		res.status(StatusCode.OK).end();
	}*/

	@Get("events")
	//@Middleware(authenticate)
	@Middleware(SSEHandler)
	public handleQueueEvents(req: IRequest, res: IResponse) {
		const handler: SSECallback = (data) => {
			res.write(formatSSE(data.event, data.data));
		}
		
		const unsubscribe = EventService.recieve({
			events: [GameEvents.MatchFound],
			identifier: req.user!.id,
			handler
		});

		req.on("close", () => {
			unsubscribe();
			MatchmakingService.removeFromQueue(req.user!.id);
		});
	}
}