import { ObjectId } from "mongodb";

export enum EOAuthProvider {
	DISCORD = "discord"
}

/**
 * User object as stored in database
 * 
 * The User<"in"> and User<"out"> variants exist because some fields change type
 * when mongodb outputs them.
 * 
 * "in" is for Users which go into the database, or **in**putted Users.
 * 
 * "out" is for Users which are returned by the database, or **out**putted Users.
 */
export interface IPlayerAccount {
	_id?: ObjectId;
	providerId: string;
	provider: EOAuthProvider;
	registerDate: Date;
	username: string;
	discriminator: string;
	avatar: string;
	xp: number;
}