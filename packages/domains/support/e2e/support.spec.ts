describe("@web/support", () => {
  it("shows support content without the catalogue app shell", () => {
    cy.visit("/support");
    cy.findByRole("heading", { level: 1, name: "How can we help?" }).should("be.visible");
    cy.findByRole("navigation", { name: "Support" }).should("be.visible");
    cy.findByRole("region", { name: "Player" }).should("not.exist");
    cy.findByRole("navigation", { name: "Projects" }).should("not.exist");
  });

  it("links back into the catalogue app", () => {
    cy.visit("/support");
    cy.findByRole("navigation", { name: "Support" }).findByRole("link", { name: "Catalogue" }).click();
    cy.url().should("match", /\/$/);
    cy.findByRole("region", { name: "Player" }).should("be.visible");
    cy.findByRole("navigation", { name: "Projects" }).should("not.exist");
  });
});
