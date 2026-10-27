import { albumPage } from "../../../../tooling/cypress/page-objects/album.page";
import { homePage } from "../../../../tooling/cypress/page-objects/home.page";

describe("@web/album cross-domain travel", () => {
  beforeEach(() => {
    cy.requireMusicCatalogue();
  });

  it("moves from home to an album and back without a full document reload", () => {
    homePage.visit();
    homePage.elements.featuredAlbumLink().then(($link: JQuery<HTMLElement>) => {
      const href = $link.attr("href");
      expect(href).to.match(/^\/album\//);
      cy.wrap($link).click();
    });

    cy.url().should("match", /\/album\/\d+/);
    albumPage.elements.homeLink().click();
    cy.url().should("match", /\/$/);
    homePage.elements.heading().should("be.visible");
    cy.findByRole("link", { name: "Music catalogue" }).should("be.visible");
  });
});
