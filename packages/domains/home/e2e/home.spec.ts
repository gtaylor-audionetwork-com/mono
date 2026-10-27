import { homePage } from "../../../../tooling/cypress/page-objects/home.page";

describe("@web/home", () => {
  beforeEach(() => {
    homePage.visit();
  });

  it("shows featured tracks without calling the Music API", () => {
    homePage.elements.featuredTracksHeading().should("be.visible");
    homePage.elements.trackPlay("Northbound Lights").should("be.visible");
  });

  it("shows a featured album when the catalogue is available", () => {
    cy.requireMusicCatalogue();
    homePage.visit();
    homePage.elements.featuredAlbumCard().should("be.visible");
    homePage.elements.featuredAlbumLink().should("be.visible");
  });
});
