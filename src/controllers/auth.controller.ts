import { Controller } from "@overnightjs/core"
import { IRequest, IResponse } from "express"
import { Get } from "@overnightjs/core"
import { config } from "../services/config.service.js";
import * as OAuthService from "../services/oauth.service.js";
import { IAuthReponse } from "../models/response/auth.response.js";
import * as DatabaseService from "../services/database.service.js";
import { EOAuthProvider } from "../models/database/playerAccount.model.js";

@Controller("auth")
export default class DefaultController {
	@Get("/")
	public oauthUrls(req: IRequest, res: IResponse<string[]>) {
		res.send([
			config.DISCORD_OAUTH_URL
		]);
	}

	@Get("discord")
	public async discordOAuth(req: IRequest<{}, { code: string }>, res: IResponse<IAuthReponse>) {

		const user = await OAuthService.discordFlow(req.query.code);

		if (!user) {
			return res.error!("login_failed");
		}

		let account = await DatabaseService.getPlayerAccountByProviderId(user.id, EOAuthProvider.DISCORD);

		if (!account) {
			await DatabaseService.createPlayerAccount(
				EOAuthProvider.DISCORD,
				user.id,
				user.username,
				user.discriminator,
				user.avatar
			);

			// Fetch again to also get the real id
			account = await DatabaseService.getPlayerAccountByProviderId(user.id, EOAuthProvider.DISCORD);
		}

		if (!account?._id) {
			return res.error!("login_failed");
		}

		const token = OAuthService.createJWT(account._id);

		const data: IAuthReponse = {
			token,
			user: {
				id: account._id,
				username: user.username,
				discriminator: user.discriminator,
				avatar: OAuthService.getDiscordAvatarURL(user.id, user.avatar)
			}
		}

		res.send(data).end();
	}
}