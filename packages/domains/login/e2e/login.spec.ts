describe("@web/login", () => {
  it("shows login in the app shell with the player", () => {
    cy.visit("/login");
    cy.findByRole("heading", { level: 1, name: "Log in" }).should("be.visible");
    cy.findByRole("button", { name: "Log in (demo)" }).should("be.visible");
    cy.findByRole("navigation", { name: "Main" }).should("be.visible");
    cy.findByRole("region", { name: "Player" }).should("be.visible");
    cy.findByRole("navigation", { name: "Projects" }).should("not.exist");
  });

  it("signs in and returns to returnTo", () => {
    cy.visit("/login?returnTo=%2Fprojects%2Fcoastal-studies");
    cy.findByRole("button", { name: "Log in (demo)" }).click();
    cy.url().should("include", "/projects/coastal-studies");
    cy.findByRole("button", { name: "Log out" }).should("be.visible");
    cy.findByRole("navigation", { name: "Projects" }).should("be.visible");
  });
});
