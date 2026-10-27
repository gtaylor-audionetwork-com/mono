import { BasePageObject } from "./base.page";

class AlbumPageObject extends BasePageObject {
  constructor() {
    super();
    Object.assign(this.elements, {
      heading: (title: string) => cy.findByRole("heading", { level: 2, name: title }),
      homeLink: () => cy.findByRole("main").findByRole("link", { name: "Home" }),
      firstTrackAddToProject: () => cy.findAllByRole("button", { name: /^Add .+ to project$/ }).first(),
    });
  }

  visit(id: string) {
    cy.visitApp(`/album/${id}`);
    return this;
  }
}

export const albumPage = new AlbumPageObject();
