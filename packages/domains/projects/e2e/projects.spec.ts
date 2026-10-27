import { homePage } from "../../../../tooling/cypress/page-objects/home.page";
import { projectPage } from "../../../../tooling/cypress/page-objects/project.page";

describe("@web/projects", () => {
  beforeEach(() => {
    cy.signInDemo();
  });

  it("opens a project from the sidebar", () => {
    homePage.visit();
    homePage.elements.projectsSidebar.projectLink(/Coastal Studies/).click();
    cy.url().should("include", "/projects/coastal-studies");
    projectPage.elements.heading("Coastal Studies").should("be.visible");
    projectPage.elements.trackTitle("Northbound Lights").should("be.visible");
  });
});
