import {HttpResponseInit} from "@azure/functions";

export const jsonResult = (statusCode: number, body: Record<string, unknown> | Array<Record<string, unknown>>): HttpResponseInit => ({
	status: statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
});