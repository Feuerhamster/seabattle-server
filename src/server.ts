import { Server } from "@overnightjs/core";
import express from "express";
import { Server as HttpServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorFunctionMiddleware } from "./middlewares/errorFunction.middleware.js";
export default class SeaBattleBackendServer extends Server {
	private server!: HttpServer;
	
	constructor() {
		super(process.env.NODE_ENV === "development");
		
		this.app.set("trust proxy", true);
		this.app.use(express.json());
		this.app.use(cors());
		this.app.use(cookieParser())
		this.app.use(errorFunctionMiddleware);
		
		this.setupControllers();
	}
	
	private async setupControllers(): Promise<void> {
		// Dynamic imports are required here to load these modules after the config has been loaded.
		const AuthController = (await import("./controllers/auth.controller.js")).default;
		const MatchmakingController = (await import("./controllers/matchmaking.controller.js")).default;
		const PlayerController = (await import("./controllers/player.controller.js")).default;
		
		super.addControllers([
			new AuthController(),
			new MatchmakingController(),
			new PlayerController()
		]);
	}
	
	public start(port: number): void {
		this.server = this.app.listen(port, () => {
			console.log("[express] Server running on " + port);
		});

	}
	
	public stop(): void {
		this.server.close();
		console.log("[express] Server stopped");
	}
}
