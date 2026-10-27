import { homePage } from "../../../tooling/cypress/page-objects/home.page";
import { projectPage } from "../../../tooling/cypress/page-objects/project.page";

function firstFeaturedTrackTitle(): Cypress.Chainable<string> {
  return cy
    .findAllByRole("button", { name: /^Play / })
    .first()
    .invoke("attr", "aria-label")
    .then((label) => String(label).replace(/^Play /, ""));
}

describe("@web/shell add to project modal", () => {
  beforeEach(() => {
    cy.signInDemo();
    cy.requireMusicCatalogue();
    homePage.visit();
  });

  it("adds a featured track to a project from the track row", () => {
    firstFeaturedTrackTitle().then((trackTitle) => {
      homePage.elements.trackAddToProject(trackTitle).scrollIntoView().click();
      cy.contains("h2", "Add to project").should("be.visible");
      cy.findByRole("button", { name: "Night Drive" }).click();
      cy.contains("h2", "Add to project").should("not.exist");

      homePage.elements.projectsSidebar.projectLink(/Night Drive/).click();
      projectPage.elements.trackTitle(trackTitle).should("be.visible");
    });
  });

  it("adds the current track from the player", () => {
    firstFeaturedTrackTitle().then((trackTitle) => {
      homePage.elements.trackPlay(trackTitle).scrollIntoView().click();
      homePage.elements.player.addToProjectButton().click();
      cy.findByRole("button", { name: "Studio Notes" }).click();

      homePage.elements.projectsSidebar.projectLink(/Studio Notes/).click();
      projectPage.elements.trackTitle(trackTitle).should("be.visible");
    });
  });
});
