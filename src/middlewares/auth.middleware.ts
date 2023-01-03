import { IRequest, IResponse, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../services/config.service.js";

// Middleware to authenticate and authorize users with jsonwebtoken
export default function authenticate(req: IRequest, res: IResponse, next: NextFunction) {
	
	if (!req.cookies.token) {
		res.error!("invalid_authorization");
		return;
	}
	
	let token = req.cookies.token;
	let decodedToken: typeof req.user;
	
	// Try to verify the jwt
	try {
		decodedToken = jwt.verify(token, config.JWT_SECRET) as unknown as typeof decodedToken;
	} catch(err) {
		res.error!("unauthorized");
		return;
	}
	
	// Set token payload to req.user
	req.user = decodedToken;
	
	next();
}