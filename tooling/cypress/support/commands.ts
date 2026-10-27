/** Visit a route and wait for the shell header (client layout) to appear. */
Cypress.Commands.add("visitApp", (path = "/") => {
  cy.visit(path);
  cy.findByRole("link", { name: "Music catalogue" }).should("be.visible");
});

/** Fail fast when catalogue pages need the Music API and it is not responding. */
Cypress.Commands.add("requireMusicCatalogue", () => {
  cy.request({ url: "/albums", failOnStatusCode: false }).then((response) => {
    expect(response.status, "GET /albums (Music API via SSR)").to.eq(200);
    expect(response.body).to.include("Albums");
  });
});

declare global {
  // Cypress command typings use the global Chainable augmentation pattern.
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required for Cypress.Commands.add
  namespace Cypress {
    interface Chainable {
      visitApp(path?: string): Chainable<void>;
      requireMusicCatalogue(): Chainable<void>;
    }
  }
}

export {};
