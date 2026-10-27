describe("@web/collection-beats", () => {
  it("uses the player API without the catalogue player bar", () => {
    cy.visit("/collection/beats");
    cy.findByRole("heading", { level: 1, name: "Beats for cats" }).should("be.visible");
    cy.findByRole("region", { name: "Player" }).should("not.exist");
    cy.findByRole("navigation", { name: "Main" }).should("not.exist");
  });

  it("plays a track from the custom deck when tracks are available", () => {
    cy.visit("/collection/beats");
    cy.findByRole("button", { name: /^Play / }).then(($buttons) => {
      if ($buttons.length === 0) {
        cy.contains("No tracks from the API").should("be.visible");
        return;
      }
      cy.wrap($buttons.first()).click();
      cy.findByRole("button", { name: /^Paws / }).should("be.visible");
    });
  });
});
