describe("@web/host marketing /work-with-us", () => {
  it("shows the page and nav link when logged out", () => {
    cy.visit("/work-with-us");
    cy.findByRole("heading", { level: 1, name: "Why work with us" }).should("be.visible");
    cy.findByRole("navigation", { name: "Marketing" })
      .findByRole("link", { name: "Why work with us" })
      .should("have.attr", "aria-current", "page");
  });

  it("hides the nav link in the catalogue app when signed in", () => {
    cy.signInDemo();
    cy.visit("/");
    cy.findByRole("navigation", { name: "Main" })
      .findByRole("link", { name: "Why work with us" })
      .should("not.exist");
    cy.findByRole("button", { name: "Log out" }).should("be.visible");
  });
});
