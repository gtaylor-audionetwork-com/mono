import { homePage } from "../../../../tooling/cypress/page-objects/home.page";

describe("@web/home", () => {
  beforeEach(() => {
    cy.requireMusicCatalogue();
    homePage.visit();
  });

  it("shows featured tracks from the featured album", () => {
    homePage.elements.featuredTracksHeading().should("be.visible");
    cy.findByRole("heading", { name: "Featured tracks" })
      .closest("section")
      .findAllByRole("listitem")
      .should("have.length.at.least", 1);
    cy.findAllByRole("button", { name: /^Play / }).first().should("be.visible");
  });

  it("shows a featured album when the catalogue is available", () => {
    homePage.elements.featuredAlbumCard().should("be.visible");
    homePage.elements.featuredAlbumLink().should("be.visible");
  });

  it("promotes the featured collection in a new tab", () => {
    cy.findByRole("heading", { name: "Featured collection" }).should("be.visible");
    cy.findByRole("link", { name: "Open Beats for cats" })
      .should("have.attr", "href", "/collection/beats")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });
});
