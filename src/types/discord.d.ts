export interface IDiscordOAuthTokenResponse {
	access_token: string,
	expires_in: number,
	refresh_token: string,
	scope: string,
	token_type: string
}

export interface IDiscordUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
}