import { IRequest, IResponse, NextFunction } from "express"
import * as ClassValidator from "class-validator"
import { plainToInstance } from "class-transformer"

import { RequestBody, Query } from "../models/request.js"
import { ObjectId } from "../models/request/objectId.request.js"

export enum EValidationDataSource {
	Body,
	Query
}

export interface ValidationMiddlewareOptions {
	skipMissingProperties ?: boolean;
	source ?: EValidationDataSource;
	groups ?: string[];
}

type Schema = { new(): RequestBody } | { new(): Query }

async function validateBody(req: IRequest<RequestBody, Query>, res: IResponse, next: NextFunction, schema: Schema, options?: ValidationMiddlewareOptions) {
	
	let _options = {
		skipMissingProperties: options?.skipMissingProperties ?? false,
		source: options?.source ?? EValidationDataSource.Body
	}
	
	switch (_options.source) {
		case EValidationDataSource.Body: {
			req.body = plainToInstance<RequestBody, object>(schema, req.body);
			break;
		}
		case EValidationDataSource.Query: {
			req.query = plainToInstance<Query, object>(schema, req.query);
			break;
		}
	}
	
	const validatorOptions: ClassValidator.ValidatorOptions = {
		always: true,
		whitelist: true,
		forbidNonWhitelisted: true,
		forbidUnknownValues: true,
		skipMissingProperties: _options.skipMissingProperties,
		groups: options?.groups ?? [],
		validationError: {
			target: false,
			value: false
		}
	};
	
	let errors: ClassValidator.ValidationError[] = await ClassValidator.validate(
		_options.source == EValidationDataSource.Query ? req.query : req.body,
		validatorOptions
	);
	
	if (errors.length < 1) return next();
	
	return res.error!("validation_error", errors);
	
}

/**
 * Validate RequestBody or Query
 * @param schema Class to use as schema
 * @param options 
 * @returns validateBody Middleware
 */
export default function validate(schema: Schema, options?: ValidationMiddlewareOptions) {
	return (req: IRequest, res: IResponse, next: NextFunction) => validateBody(req, res, next, schema, options);
}

/**
 * Validate RequestBody treating all fields as optional
 * @param schema Class to use as schema
 * @returns validateBody Middleware
 */
export function validateOptional(schema: Schema) {
	let options = {
		skipMissingProperties: true,
		validationGroupFromEntryType: true
	}
	
	return (req: IRequest, res: IResponse, next: NextFunction) => validateBody(req, res, next, schema, options);
}

/**
 * Middleware to validate MongoDB's ObjectId in url params
 */
export async function validateId(req: IRequest, res: IResponse, next: NextFunction) {
	
	req.params = plainToInstance<ObjectId, object>(ObjectId, req.params);
	
	let errors: ClassValidator.ValidationError[] = await ClassValidator.validate(req.params, {
		always: true,
		whitelist: true
	});
	
	// Go next if there is no errors
	if (errors.length < 1) return next();
	
	return res.error!("validation_error", errors);
}