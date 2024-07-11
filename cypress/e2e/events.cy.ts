import { events, userToEvents } from "@/db/schema";
import { getCyDB } from "cypress/support/commands";
import { eq, inArray } from "drizzle-orm";

describe("Events Page", () => {
	beforeEach(() => {
		// Login before each test
		cy.login();

		// Visit group selection page
		cy.visit("http://localhost:3000/jzz0lrhlxckxf90/events");
	});
	after(async () => {
		// Clear test group
		const db = getCyDB();
		const eventList = await db.query.events.findMany({
			where: eq(events.groupId, "jzz0lrhlxckxf90"),
		});
		await db.delete(events).where(eq(events.groupId, "jzz0lrhlxckxf90"));
		if (eventList.length > 0) {
			await db.delete(userToEvents).where(
				inArray(
					userToEvents.eventId,
					eventList.map((e) => e.id)
				)
			);
		}
	});
	it("should allow users to create and view events", () => {
		// Send a message
		cy.get("button").contains("Create Event").click();

		// Get name input
		cy.get("input[name='name']").type("Test Event");

		// Set description
		cy.get("textarea[name='description']").type("This is a test event");

		// Set date to today
		const startDate = new Date();
		cy.get("input[name='startsAt']").type(startDate.toISOString().slice(0, 16));

		// Set end date to an hour from now
		const endDate = new Date(Date.now() + 60 * 60 * 1000);
		cy.get("input[name='endsAt']").type(endDate.toISOString().slice(0, 16));

		// Submit the form
		cy.get("button").contains("Submit").click();

		// Verify you can see the event
		cy.get("div").contains("Test Event").should("exist");
	});
	it("should allow users to accept/decline events", () => {
		// Open the event
		cy.get("p").contains("Test Event").click();

		// Verify the title and description
		cy.get("h2").contains("Test Event").should("exist");
		cy.get("p").contains("This is a test event").should("exist");

		// Accept the event
		cy.get("button").contains("Accept").click();

		// Verify I show up as accepted
		cy.get("p").contains("MEMBERS").should("exist");
		cy.get("p").contains("Accepted").should("exist");

		// Decline the event
		cy.get("button").contains("Decline").click();
		cy.get("p").contains("Declined").should("exist");
	});
});
