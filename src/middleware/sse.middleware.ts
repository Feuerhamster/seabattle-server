import { IRequest, IResponse, NextFunction } from "express";
import { GameEvents } from "../types/sse.js";
import { formatSSE } from "../utils/formatSSE.js";

export function SSEHandler(req: IRequest, res: IResponse, next: NextFunction) {
	// Establish SSE
	res.writeHead(200, {
		"Cache-Control": "no-cache",
		"Content-Type": "text/event-stream",
		"Connection": "Keep-Alive",
		"Transfer-Encoding": "chunked"
	});
	res.write("\n");

	// Ping interval to prevent browser error because no data received
	let pingInterval = setInterval(() => {
		res.write(formatSSE(GameEvents.Ping));
	}, 5 * 1000);

	// Remove listener and end ping interval
	req.on("close", () => {
		clearInterval(pingInterval);
	});

	next();
}