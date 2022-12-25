export type SSECallback = (data: IEventMessage) => void;

export enum GameEvents {
	MatchFound = "match-found",
	Ping = "ping"
}

export interface IEventMessage {
	to: string;
	from: string;
	event: GameEvents;
	data: any;
}