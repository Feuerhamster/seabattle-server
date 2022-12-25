import { StatusCode } from "../../types/httpStatusCodes";

export const responseErrorCodes = {
	"login_failed": StatusCode.BadRequest,
	"validation_error": StatusCode.UnprocessableEntity,
	"invalid_authorization": StatusCode.Unauthorized,
	"unauthorized": StatusCode.Unauthorized
} as const;

export type ResponseErrorCode = keyof typeof responseErrorCodes;
