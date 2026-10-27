import { BasePageObject } from "./base.page";

class ProjectPageObject extends BasePageObject {
  constructor() {
    super();
    Object.assign(this.elements, {
      heading: (name: string) => cy.findByRole("heading", { level: 2, name: name }),
      trackTitle: (title: string) => cy.findByRole("main").findByText(title),
    });
  }

  visit(id: string) {
    cy.visitApp(`/projects/${id}`);
    return this;
  }
}

export const projectPage = new ProjectPageObject();
