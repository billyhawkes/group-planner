describe("Media Page", () => {
	beforeEach(() => {
		// Login before each test
		cy.login();

		// Visit group selection page
		cy.visit("http://localhost:3000/jzz0lrhlxckxf90/media");
	});
	it("should allow users to upload media", () => {
		// Upload image
		cy.get("div").contains("Upload").selectFile("cypress/e2e/test.jpg");

		// Check if the image was uploaded
		cy.get("img").should("exist");

		// Delete the image
		cy.get("[data-cy='delete-media']").click({
			multiple: true,
		});
	});
});
