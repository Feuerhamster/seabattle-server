export type SSECallback = (data: IEventMessage) => void;

export enum GameEvents {
	MatchFound = "match-found",
	Challenged = "challenged",
	Ping = "ping"
}

export interface IEventMessage {
	to: string;
	from: string;
	event: GameEvents;
	data?: any;
}

export interface IReceiverOptions {
	events: GameEvents[];
	identifier: string;
	handler: SSECallback;
}