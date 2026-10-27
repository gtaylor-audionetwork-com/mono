import { homePage } from "../../../tooling/cypress/page-objects/home.page";

describe("@web/shell download options modal", () => {
  it("opens once from a track row and closes on cancel", () => {
    cy.requireMusicCatalogue();
    homePage.visit();
    cy.findAllByRole("button", { name: /^Play / })
      .first()
      .invoke("attr", "aria-label")
      .then((label) => {
        const trackTitle = String(label).replace(/^Play /, "");
        cy.findByRole("button", { name: `Download ${trackTitle}` }).scrollIntoView().click();
        cy.contains("h2", "Download options").should("be.visible");
        cy.findByRole("button", { name: "Cancel" }).click();
        cy.contains("h2", "Download options").should("not.exist");
      });
  });
});
