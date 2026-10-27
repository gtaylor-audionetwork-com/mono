describe("@web/host marketing /support", () => {
  it("shows support content without the catalogue app shell", () => {
    cy.visit("/support");
    cy.findByRole("heading", { level: 1, name: "Support" }).should("be.visible");
    cy.findByRole("region", { name: "Player" }).should("not.exist");
    cy.findByRole("navigation", { name: "Projects" }).should("not.exist");
  });

  it("links back into the catalogue app", () => {
    cy.visit("/support");
    cy.findByRole("link", { name: "Open catalogue" }).click();
    cy.url().should("match", /\/$/);
    cy.findByRole("link", { name: "My monorepo" }).should("be.visible");
    cy.findByRole("navigation", { name: "Projects" }).should("be.visible");
  });
});
