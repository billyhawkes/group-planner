import { resolveResponse } from "@trpc/server/http";
import { appRouter } from "src/server";
import { createTRPCContext } from "src/server/trpc";
import {
	eventHandler,
	getRequestURL,
	getWebRequest,
	setHeader,
	setResponseStatus,
} from "vinxi/http";

// Handles trpc requests
export default eventHandler(async (event) => {
	const url = getRequestURL(event);
	const path = url.pathname.replace(/^\/trpc/, "").slice(1);
	const req = getWebRequest(event);

	// Resolve the response based on the path
	const { status, headers, body } = await resolveResponse({
		router: appRouter,
		req,
		path,
		error: null,
		createContext: () => createTRPCContext({ event }),
	});

	// Set the response status and headers
	setResponseStatus(event, status);
	headers &&
		Object.keys(headers).forEach((key) => {
			if (headers.get(key)) {
				setHeader(event, key, headers.get(key)!);
			}
		});

	return body;
});
