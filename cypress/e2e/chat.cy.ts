import { messages } from "@/db/schema";
import { getCyDB } from "cypress/support/commands";
import { eq } from "drizzle-orm";

describe("Chat Page", () => {
	beforeEach(async () => {
		// Login before each test
		cy.login();

		// Clear test group
		const db = getCyDB();
		await db.delete(messages).where(eq(messages.groupId, "jzz0lrhlxckxf90"));

		// Visit group selection page
		cy.visit("http://localhost:3000/dashboard");

		// Select testing group
		cy.get("a").contains("Testing").click();
	});
	it("should allow users to send messages", () => {
		// Send a message
		cy.get("input").type("Hello, world!{enter}");

		// Check if the message was sent
		cy.get("div").contains("Hello, world!").should("exist");

		// Check if the message persists
		cy.reload();
		cy.get("div").contains("Hello, world!").should("exist");
	});
	it("should stack messages under one name and date", () => {
		// Send multiple messages
		cy.get("input").type("Hello{enter}");
		cy.get("input").type("Hello2{enter}");

		// Check if the messages were sent
		cy.get("div").contains("Hello").should("exist");
		cy.get("div").contains("Hello2").should("exist");

		// Should only have one date and name
		cy.get("[data-cy='name-date']").should("have.length", 1);
	});
});
