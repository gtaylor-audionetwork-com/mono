import path from "node:path";
import { fileURLToPath } from "node:url";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Layers, most specific pattern first. See README for the diagram.
const elements = [
  { type: "host", pattern: "apps/host" },
  { type: "dev-harness", pattern: "packages/domains/*/dev" },
  { type: "domain", pattern: "packages/domains/*" },
  { type: "shell", pattern: "packages/shell" },
  { type: "composite", pattern: "packages/composites/*" },
  { type: "action", pattern: "packages/actions" },
  { type: "data", pattern: "packages/data" },
  { type: "api", pattern: "packages/api/*" },
  { type: "ui", pattern: "packages/foundations/*" },
];

const allow = (from, to) => ({
  from: { element: { type: from } },
  allow: { to: { element: { types: { anyOf: to } } } },
});

export default tseslint.config(
  { ignores: ["**/.next/**", "**/node_modules/**", "**/next-env.d.ts"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/root-path": repoRoot,
      "boundaries/elements": elements,
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: path.join(repoRoot, "{apps,packages}/**/tsconfig.json"),
          noWarnOnMultipleProjects: true,
        },
      },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            // Every layer may import its own files.
            { allow: { dependency: { relationship: { to: "internal" } } } },
            allow("host", ["shell", "domain"]),
            allow("dev-harness", ["shell", "domain"]),
            allow("domain", ["composite", "action", "data", "ui"]),
            allow("shell", ["action", "data", "ui"]),
            allow("composite", ["action", "data", "ui"]),
            allow("action", ["data", "ui"]),
            allow("data", ["api"]),
            // api and ui import nothing from the workspace.
            // External packages (react, next, @tanstack/*) are allowed. React is blocked
            // in api via the `noReact` config below.
            { allow: { to: { module: { origin: "external" } } } },
            { allow: { to: { module: { origin: "core" } } } },
          ],
        },
      ],
    },
  },
);

/** Extra rules for packages that must stay framework-free (api clients). */
export const noReact = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: ["react", "react-dom", "react/*", "@tanstack/*", "next", "next/*"], message: "API clients must not depend on React or Next.js." },
        ],
      },
    ],
  },
};
