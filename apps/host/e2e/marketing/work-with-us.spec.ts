describe("@web/host catalogue /work-with-us", () => {
  it("shows the page with player and nav link when logged out", () => {
    cy.visit("/work-with-us");
    cy.findByRole("heading", { level: 1, name: "Why work with us" }).should("be.visible");
    cy.findByRole("region", { name: "Player" }).should("be.visible");
    cy.findByRole("navigation", { name: "Main" })
      .findByRole("link", { name: "Why work with us" })
      .should("have.attr", "aria-current", "page");
    cy.findByRole("navigation", { name: "Projects" }).should("not.exist");
  });

  it("hides the nav link when signed in", () => {
    cy.signInDemo();
    cy.visit("/");
    cy.findByRole("navigation", { name: "Main" })
      .findByRole("link", { name: "Why work with us" })
      .should("not.exist");
    cy.findByRole("navigation", { name: "Projects" }).should("be.visible");
  });
});
