import { getDB } from "@/db";
import { users } from "@/db/schema";
import { getLucia } from "@/lib/lucia";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import {
	eventHandler,
	getCookie,
	getQuery,
	getRequestURL,
	sendRedirect,
	setCookie,
} from "vinxi/http";
import { z } from "zod";

// Initialize Lucia
export default eventHandler(async (event) => {
	const url = getRequestURL(event);

	// Initialize Google OAuth
	const google = new Google(
		process.env.GOOGLE_CLIENT_ID!,
		process.env.GOOGLE_CLIENT_SECRET!,
		`${process.env.VITE_SITE_URL}/auth/google/callback`
	);
	// Initialize the database and Lucia
	const db = getDB();
	const lucia = getLucia();

	// Sign out
	if (url.pathname === "/auth/signout" || url.pathname === "/auth/signout/") {
		const session = getCookie(event, "auth_session");
		if (!session) return;
		// Create a blank session cookie
		const blankCookie = lucia.createBlankSessionCookie();
		// Invalidate the session and set the blank cookie
		setCookie(event, blankCookie.name, blankCookie.value, blankCookie.attributes);
		await lucia.invalidateSession(session);
	}
	if (url.pathname === "/auth/google" || url.pathname === "/auth/google/") {
		// Generate a state and code verifier
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
			scopes: ["profile", "email"],
		});
		// Set the cookies for google auth
		setCookie(event, "state", state, {
			secure: process.env.NODE_ENV === "production",
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 min
		});
		setCookie(event, "codeVerifier", codeVerifier, {
			secure: process.env.NODE_ENV === "production",
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 min
		});
		// Redirect to the google auth page
		return sendRedirect(event, url.toString());
	}

	if (url.pathname === "/auth/google/callback" || url.pathname === "/auth/google/callback/") {
		// Validations
		const query = getQuery(event);
		const code = z.string().parse(query.code);
		const state = z.string().parse(query.state);
		const storedState = getCookie(event, "state");
		const storedCodeVerifier = getCookie(event, "codeVerifier");

		if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
			throw new Error("Invalid request");
		}

		// Exchange the authorization code for tokens
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

		// Fetch the user's profile
		const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const user: unknown = await response.json();
		const { sub: googleId, email } = z
			.object({
				sub: z.string(),
				email: z.string(),
			})
			.parse(user);

		let userId: string;
		const existingUser = await db.query.users.findFirst({
			where: eq(users.googleId, googleId),
		});

		// Create a new user if they don't exist
		if (!existingUser) {
			userId = generateId(15);
			await db.insert(users).values({
				id: userId,
				email,
				googleId,
				name: "Anonymous",
			});
		} else {
			userId = existingUser.id;
		}
		// Create a session for the user
		const session = await lucia.createSession(userId, {
			email,
			googleId,
		});
		// Set the session cookie
		const sessionCookie = lucia.createSessionCookie(session.id);
		setCookie(event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return sendRedirect(event, "/dashboard");
	}

	return {
		url: url.pathname,
	};
});
