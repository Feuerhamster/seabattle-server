import { IsEnum, Matches } from "class-validator";
import { GameModes } from "../../gamemodes/index.js";
import { RequestBody } from "../request.js";
import { idRegex } from "./objectId.request.js";

export class JoinMatchmaking extends RequestBody {
	@IsEnum(GameModes)
	gamemode !: GameModes;
}

export class ChallengePlayer extends RequestBody {
	@Matches(idRegex)
	playerId !: string;
}