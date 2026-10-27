#!/usr/bin/env node
/**
 * Maps git-changed paths to Cypress spec files. Used locally and in GitHub Actions
 * to run a subset of E2E instead of the full suite.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const ALL_SPECS = [
  "packages/domains/home/e2e/home.spec.ts",
  "packages/domains/album/e2e/albums.spec.ts",
  "packages/domains/album/e2e/album-tracks.spec.ts",
  "packages/domains/album/e2e/cross-domain-travel.spec.ts",
  "packages/domains/projects/e2e/projects.spec.ts",
  "packages/shell/e2e/navigation.spec.ts",
  "packages/shell/e2e/add-to-project.spec.ts",
  "packages/shell/e2e/download-modal.spec.ts",
].map((spec) => path.join(repoRoot, spec));

const SMOKE_SPECS = [path.join(repoRoot, "packages/shell/e2e/navigation.spec.ts")];

/** Longest-prefix wins within a group; union across matching rules. */
const RULES = [
  {
    test: (file) => file.startsWith("packages/domains/home/"),
    specs: () => [
      "packages/domains/home/e2e/home.spec.ts",
      "packages/shell/e2e/navigation.spec.ts",
    ],
  },
  {
    test: (file) => file.startsWith("packages/domains/album/"),
    specs: () => [
      "packages/domains/album/e2e/albums.spec.ts",
      "packages/domains/album/e2e/album-tracks.spec.ts",
      "packages/domains/album/e2e/cross-domain-travel.spec.ts",
      "packages/shell/e2e/navigation.spec.ts",
    ],
  },
  {
    test: (file) => file.startsWith("packages/domains/projects/"),
    specs: () => [
      "packages/domains/projects/e2e/projects.spec.ts",
      "packages/shell/e2e/navigation.spec.ts",
    ],
  },
  {
    test: (file) =>
      file.startsWith("packages/shell/") ||
      file.startsWith("packages/actions/") ||
      file.startsWith("packages/data/") ||
      file.startsWith("packages/composites/"),
    specs: () => [
      "packages/shell/e2e/navigation.spec.ts",
      "packages/shell/e2e/add-to-project.spec.ts",
      "packages/shell/e2e/download-modal.spec.ts",
    ],
  },
  {
    test: (file) => file.startsWith("apps/host/") || file.startsWith("tooling/cypress/"),
    specs: () => ALL_SPECS.map((absolute) => path.relative(repoRoot, absolute)),
  },
];

function parseArgs(argv) {
  const args = { base: "main", format: "list" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--base") {
      args.base = argv[index + 1] ?? args.base;
      index += 1;
    } else if (argv[index] === "--format") {
      args.format = argv[index + 1] ?? args.format;
      index += 1;
    }
  }
  return args;
}

function gitChangedFiles(baseRef) {
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: repoRoot, stdio: "ignore" });
  } catch {
    return null;
  }

  let mergeBase = baseRef;
  try {
    mergeBase = execSync(`git merge-base ${baseRef} HEAD`, { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch {
    try {
      mergeBase = execSync(`git rev-parse ${baseRef}`, { cwd: repoRoot, encoding: "utf8" }).trim();
    } catch {
      return null;
    }
  }

  const output = execSync(`git diff --name-only ${mergeBase}...HEAD`, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function resolveSpecs(relativeSpecs) {
  const unique = new Set();
  for (const relative of relativeSpecs) {
    const absolute = path.join(repoRoot, relative);
    if (existsSync(absolute)) unique.add(absolute);
  }
  return [...unique];
}

function selectSpecs(changedFiles) {
  if (!changedFiles || changedFiles.length === 0) {
    return SMOKE_SPECS;
  }

  const onlyMeta = changedFiles.every(
    (file) =>
      file.endsWith(".md") ||
      (file.startsWith(".github/") && !file.includes("workflows/ci")),
  );
  if (onlyMeta) {
    return SMOKE_SPECS;
  }

  const relativeSelected = new Set();
  let matchedRule = false;

  for (const file of changedFiles) {
    for (const rule of RULES) {
      if (!rule.test(file)) continue;
      matchedRule = true;
      for (const spec of rule.specs()) {
        relativeSelected.add(spec);
      }
    }
  }

  if (!matchedRule) {
    return SMOKE_SPECS;
  }

  if (relativeSelected.size === 0) {
    return SMOKE_SPECS;
  }

  return resolveSpecs([...relativeSelected]);
}

const hostRoot = path.join(repoRoot, "apps/host");

/** Cypress `--spec` paths are resolved from `apps/host` (where cypress.config lives). */
function toHostRelative(absoluteSpec) {
  return path.relative(hostRoot, absoluteSpec);
}

function formatOutput(specs, format) {
  const repoRelative = specs.map((absolute) => path.relative(repoRoot, absolute));
  const cypressRelative = specs.map(toHostRelative);

  if (format === "cypress" || format === "github") {
    return cypressRelative.join(",");
  }
  return repoRelative.join("\n");
}

function main() {
  const { base, format } = parseArgs(process.argv.slice(2));
  const changed = gitChangedFiles(base);
  const specs = selectSpecs(changed);
  const body = formatOutput(specs, format);

  if (format === "github") {
    process.stdout.write(`specs=${body}\n`);
    process.stdout.write(`count=${specs.length}\n`);
    return;
  }

  process.stdout.write(body);
  if (!body.endsWith("\n")) process.stdout.write("\n");
}

main();
