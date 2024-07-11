/// <reference types="cypress" />

import { getDB } from "@/db";

declare global {
	namespace Cypress {
		interface Chainable {
			login(): Chainable<void>;
		}
	}
}

// cypress/support/commands.js
Cypress.Commands.add("login", () => {
	cy.setCookie("auth_session", "w5zf66zwyvvotdw7uhhnqgqjqzqwmvrbeeq42py2");
});

export const getCyDB = () => {
	const db = getDB({
		url: Cypress.env("databaseUrl"),
		token: Cypress.env("databaseToken"),
	});
	return db;
};
