import { homePage } from "../../../tooling/cypress/page-objects/home.page";
import { projectPage } from "../../../tooling/cypress/page-objects/project.page";

describe("@web/shell add to project modal", () => {
  beforeEach(() => {
    homePage.visit();
  });

  it("adds a featured track to a project from the track row", () => {
    homePage.elements.trackAddToProject("Northbound Lights").scrollIntoView().click();
    cy.contains("h2", "Add to project").should("be.visible");
    cy.findByRole("button", { name: "Night Drive" }).click();
    cy.contains("h2", "Add to project").should("not.exist");

    homePage.elements.projectsSidebar.projectLink(/Night Drive/).click();
    projectPage.elements.trackTitle("Northbound Lights").should("be.visible");
  });

  it("adds the current track from the player", () => {
    homePage.elements.trackPlay("Copper Weather").scrollIntoView().click();
    homePage.elements.player.addToProjectButton().click();
    cy.findByRole("button", { name: "Studio Notes" }).click();

    homePage.elements.projectsSidebar.projectLink(/Studio Notes/).click();
    projectPage.elements.trackTitle("Copper Weather").should("be.visible");
  });
});
