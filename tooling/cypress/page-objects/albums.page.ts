import { BasePageObject } from "./base.page";

class AlbumsPageObject extends BasePageObject {
  readonly urls = { albums: "/albums" };

  constructor() {
    super();
    Object.assign(this.elements, {
      heading: () => cy.findByRole("heading", { level: 1, name: "Albums" }),
      intro: () => cy.contains("The first six albums in the core catalogue."),
      firstAlbumOpenLink: () => cy.findAllByRole("link", { name: /^Open / }).first(),
      albumCards: () => cy.findAllByRole("heading", { level: 2 }),
    });
  }

  visit() {
    cy.visitApp(this.urls.albums);
    return this;
  }
}

export const albumsPage = new AlbumsPageObject();
