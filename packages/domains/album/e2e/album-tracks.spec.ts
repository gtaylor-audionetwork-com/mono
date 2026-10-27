import { albumPage } from "../../../../tooling/cypress/page-objects/album.page";
import { albumsPage } from "../../../../tooling/cypress/page-objects/albums.page";

describe("@web/album detail", () => {
  beforeEach(() => {
    cy.requireMusicCatalogue();
    albumsPage.visit();
    albumsPage.elements.firstAlbumOpenLink().click();
    cy.url().should("match", /\/album\/\d+/);
  });

  it("shows tracks with play and add-to-project actions", () => {
    cy.findAllByRole("button", { name: /^Play / }).should("have.length.at.least", 1);
    albumPage.elements.firstTrackAddToProject().should("be.visible");
  });

  it("links to the album from the player after playback starts", () => {
    cy.findAllByRole("button", { name: /^Play / }).first().click();
    albumPage.elements.player.albumLink().should("be.visible");
  });
});
