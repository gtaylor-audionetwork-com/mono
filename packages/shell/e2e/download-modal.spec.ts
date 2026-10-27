import { homePage } from "../../../tooling/cypress/page-objects/home.page";

describe("@web/shell download options modal", () => {
  it("opens once from a track row and closes on cancel", () => {
    homePage.visit();
    cy.findByRole("button", { name: "Download Northbound Lights" }).scrollIntoView().click();
    cy.contains("h2", "Download options").should("be.visible");
    cy.findByRole("button", { name: "Cancel" }).click();
    cy.contains("h2", "Download options").should("not.exist");
  });
});
