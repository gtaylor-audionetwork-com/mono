import { albumsPage } from "../../../tooling/cypress/page-objects/albums.page";
import { homePage } from "../../../tooling/cypress/page-objects/home.page";

describe("@web/shell navigation", () => {
  it("links Home and Albums in the header", () => {
    homePage.visit();
    homePage.elements.header.homeLink().should("have.attr", "aria-current", "page");

    homePage.elements.header.albumsLink().click();
    cy.url().should("include", "/albums");
    albumsPage.elements.heading().should("be.visible");

    albumsPage.elements.header.homeLink().click();
    cy.url().should("match", /\/$/);
    homePage.elements.heading().should("be.visible");
  });

  it("lists seed projects in the sidebar", () => {
    homePage.visit();
    homePage.elements.projectsSidebar.heading().should("be.visible");
    homePage.elements.projectsSidebar.projectLink(/Coastal Studies/).should("be.visible");
    homePage.elements.projectsSidebar.projectLink(/Night Drive/).should("be.visible");
    homePage.elements.projectsSidebar.projectLink(/Studio Notes/).should("be.visible");
  });
});
