import { BasePageObject } from "./base.page";

class HomePageObject extends BasePageObject {
  readonly urls = { home: "/" };

  constructor() {
    super();
    Object.assign(this.elements, {
      heading: () => cy.findByRole("heading", { level: 1, name: "New this week" }),
      featuredCollectionCard: () => cy.findByRole("heading", { name: "Featured collection" }),
      featuredCollectionLink: () => cy.findByRole("link", { name: "Open Beats for cats" }),
      featuredAlbumCard: () => cy.findByRole("heading", { name: "Featured album" }),
      featuredAlbumLink: () => cy.findAllByRole("link", { name: /^Open / }).first(),
      featuredTracksHeading: () => cy.findByRole("heading", { name: "Featured tracks" }),
      trackAddToProject: (trackTitle: string) =>
        cy.findByRole("button", { name: `Add ${trackTitle} to project` }),
      trackPlay: (trackTitle: string) => cy.findByRole("button", { name: `Play ${trackTitle}` }),
    });
  }

  visit() {
    cy.visitApp(this.urls.home);
    return this;
  }
}

export const homePage = new HomePageObject();
