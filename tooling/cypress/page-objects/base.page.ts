/** Shell chrome shared by every page object. Domain pages merge selectors in their constructor. */
export class BasePageObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- page objects merge selectors at runtime
  elements: any = {
    header: {
      brandLink: () => cy.findByRole("link", { name: "Music catalogue" }),
      homeLink: () => cy.findByRole("navigation", { name: "Main" }).findByRole("link", { name: "Home" }),
      albumsLink: () => cy.findByRole("navigation", { name: "Main" }).findByRole("link", { name: "Albums" }),
    },
    projectsSidebar: {
      root: () => cy.findByRole("navigation", { name: "Projects" }),
      heading: () => cy.findByRole("navigation", { name: "Projects" }).findByRole("heading", { name: "Projects" }),
      projectLink: (name: string | RegExp) =>
        cy.findByRole("navigation", { name: "Projects" }).findByRole("link", {
          name: typeof name === "string" ? new RegExp(name, "i") : name,
        }),
    },
    player: {
      root: () => cy.findByRole("region", { name: "Player" }),
      playToggle: () => cy.findByRole("region", { name: "Player" }).findByRole("button", { name: /Start playing|Stop playing/ }),
      albumLink: () => cy.findByRole("region", { name: "Player" }).findByRole("link", { name: /^From the album / }),
      addToProjectButton: () =>
        cy.findByRole("region", { name: "Player" }).findByRole("button", { name: /^Add .+ to project$/ }),
    },
    addToProjectDialog: {
      root: () => cy.get("dialog[open]"),
      heading: () => cy.get("dialog[open]").findByRole("heading", { name: "Add to project" }),
      projectButton: (name: string) => cy.get("dialog[open]").findByRole("button", { name }),
      cancelButton: () => cy.get("dialog[open]").findByRole("button", { name: "Cancel" }),
    },
    downloadDialog: {
      root: () => cy.get("dialog[open]"),
      heading: () => cy.get("dialog[open]").findByRole("heading", { name: "Download options" }),
      cancelButton: () => cy.get("dialog[open]").findByRole("button", { name: "Cancel" }),
    },
  };
}
