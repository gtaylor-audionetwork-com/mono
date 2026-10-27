import { homePage } from "../../../../tooling/cypress/page-objects/home.page";
import { projectPage } from "../../../../tooling/cypress/page-objects/project.page";

describe("@web/projects auth (host middleware)", () => {
  it("redirects anonymous users to support", () => {
    cy.visit("/projects/coastal-studies");
    cy.url().should("include", "/support");
    cy.url().should("include", "returnTo=%2Fprojects%2Fcoastal-studies");
    cy.findByRole("heading", { level: 1, name: "Support" }).should("be.visible");
  });

  it("opens a project when the demo session cookie is set", () => {
    cy.signInDemo();
    homePage.visit();
    homePage.elements.projectsSidebar.projectLink(/Coastal Studies/).click();
    cy.url().should("include", "/projects/coastal-studies");
    projectPage.elements.heading("Coastal Studies").should("be.visible");
  });
});
