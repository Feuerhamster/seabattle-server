import { IsEnum, Matches } from "class-validator";
import { GameModes } from "../../types/game";
import { RequestBody } from "../request";
import { idRegex } from "./objectId.request";

export class JoinMatchmaking extends RequestBody {
	@IsEnum(GameModes)
	gamemode !: GameModes;
}

export class ChallengePlayer extends RequestBody {
	@Matches(idRegex)
	playerId !: string;
}