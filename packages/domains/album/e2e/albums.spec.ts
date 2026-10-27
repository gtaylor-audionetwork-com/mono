import { albumsPage } from "../../../../tooling/cypress/page-objects/albums.page";

describe("@web/album albums index", () => {
  beforeEach(() => {
    cy.requireMusicCatalogue();
    albumsPage.visit();
  });

  it("lists the first six core catalogue albums", () => {
    albumsPage.elements.heading().should("be.visible");
    albumsPage.elements.intro().should("be.visible");
    albumsPage.elements.albumCards().should("have.length.at.least", 1);
    albumsPage.elements.firstAlbumOpenLink().should("be.visible");
  });
});
