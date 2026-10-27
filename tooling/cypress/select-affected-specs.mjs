#!/usr/bin/env node
/**
 * Maps git-changed paths to Cypress spec files. Used locally and in GitHub Actions
 * to run a subset of E2E instead of the full suite.
 *
 * Host paths use first-match rules so `(marketing)/` edits do not pull the full suite.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const SPEC = {
  home: "packages/domains/home/e2e/home.spec.ts",
  albums: "packages/domains/album/e2e/albums.spec.ts",
  albumTracks: "packages/domains/album/e2e/album-tracks.spec.ts",
  crossDomain: "packages/domains/album/e2e/cross-domain-travel.spec.ts",
  projects: "packages/domains/projects/e2e/projects.spec.ts",
  projectsAuth: "packages/domains/projects/e2e/projects-auth.spec.ts",
  nav: "packages/shell/e2e/navigation.spec.ts",
  addToProject: "packages/shell/e2e/add-to-project.spec.ts",
  downloadModal: "packages/shell/e2e/download-modal.spec.ts",
  marketingSupport: "apps/host/e2e/marketing/support.spec.ts",
};

const ALL_SPECS = [
  SPEC.home,
  SPEC.albums,
  SPEC.albumTracks,
  SPEC.crossDomain,
  SPEC.projects,
  SPEC.projectsAuth,
  SPEC.nav,
  SPEC.addToProject,
  SPEC.downloadModal,
  SPEC.marketingSupport,
].map((relative) => path.join(repoRoot, relative));

const SMOKE_SPECS = [path.join(repoRoot, SPEC.nav)];

const SPEC_SETS = {
  smoke: [SPEC.nav],
  marketing: [SPEC.marketingSupport],
  hostAppIntegration: [SPEC.nav, SPEC.home, SPEC.crossDomain],
  hostRoot: [SPEC.nav, SPEC.marketingSupport],
  shell: [SPEC.nav, SPEC.addToProject, SPEC.downloadModal],
  home: [SPEC.home, SPEC.nav],
  album: [SPEC.albums, SPEC.albumTracks, SPEC.crossDomain, SPEC.nav],
  projects: [SPEC.projects, SPEC.projectsAuth, SPEC.nav],
  full: ALL_SPECS.map((absolute) => path.relative(repoRoot, absolute)),
};

/**
 * First matching rule wins for each changed file (most specific host paths first).
 * @param {string} file
 * @returns {string[] | null}
 */
function specsForChangedFile(file) {
  if (file.startsWith("tooling/cypress/")) {
    return SPEC_SETS.full;
  }
  if (file.startsWith("apps/host/app/(marketing)/")) {
    return SPEC_SETS.marketing;
  }
  if (file.startsWith("apps/host/app/(app)/")) {
    return SPEC_SETS.hostAppIntegration;
  }
  if (file.startsWith("apps/host/app/api/")) {
    return SPEC_SETS.hostAppIntegration;
  }
  if (file.startsWith("apps/host/middleware.") || file.startsWith("apps/host/lib/session.")) {
    return [...SPEC_SETS.hostAppIntegration, SPEC.projects, SPEC.projectsAuth];
  }
  if (file.startsWith("apps/host/e2e/marketing/")) {
    return SPEC_SETS.marketing;
  }
  if (file.startsWith("apps/host/")) {
    return SPEC_SETS.hostRoot;
  }
  if (file.startsWith("packages/domains/home/")) {
    return SPEC_SETS.home;
  }
  if (file.startsWith("packages/domains/album/")) {
    return SPEC_SETS.album;
  }
  if (file.startsWith("packages/domains/projects/")) {
    return SPEC_SETS.projects;
  }
  if (
    file.startsWith("packages/shell/") ||
    file.startsWith("packages/actions/") ||
    file.startsWith("packages/data/") ||
    file.startsWith("packages/composites/") ||
    file.startsWith("packages/api/download/")
  ) {
    return SPEC_SETS.shell;
  }
  return null;
}

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
    const specs = specsForChangedFile(file);
    if (!specs) continue;
    matchedRule = true;
    for (const spec of specs) {
      relativeSelected.add(spec);
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

export { specsForChangedFile, SPEC_SETS };

export function getAffectedPlan(baseRef) {
  const changedFiles = gitChangedFiles(baseRef) ?? [];
  const cypressSpecsAbsolute = selectSpecs(changedFiles.length ? changedFiles : null);
  const cypressSpecs = cypressSpecsAbsolute.map((absolute) => path.relative(repoRoot, absolute));
  const selectedSet = new Set(cypressSpecs);
  const allRelative = ALL_SPECS.map((absolute) => path.relative(repoRoot, absolute));
  const skippedCypressSpecs = allRelative.filter((spec) => !selectedSet.has(spec));
  const pipelineTests = pipelineTestsForCypressSpecs(cypressSpecs);
  return { changedFiles, cypressSpecs, skippedCypressSpecs, pipelineTests };
}

/** CI runs these Node tests instead of Cypress — same targeting, no Music API. */
function pipelineTestsForCypressSpecs(cypressSpecs) {
  const tests = new Set();
  for (const spec of cypressSpecs) {
    if (spec.startsWith("packages/domains/home/")) {
      tests.add("packages/domains/home/pipeline.test.mjs");
    } else if (spec.startsWith("packages/domains/album/")) {
      tests.add("packages/domains/album/pipeline.test.mjs");
    } else if (spec.startsWith("packages/domains/projects/")) {
      tests.add("packages/domains/projects/pipeline.test.mjs");
    } else if (spec.startsWith("packages/shell/")) {
      tests.add("packages/shell/pipeline.test.mjs");
    } else if (spec.startsWith("apps/host/")) {
      tests.add("apps/host/pipeline.test.mjs");
    }
  }
  return [...tests].sort();
}

function main() {
  const { base, format } = parseArgs(process.argv.slice(2));
  const { cypressSpecs } = getAffectedPlan(base);
  const specsAbsolute = resolveSpecs(cypressSpecs);
  const body = formatOutput(specsAbsolute, format);

  if (format === "github") {
    process.stdout.write(`specs=${body}\n`);
    process.stdout.write(`count=${specsAbsolute.length}\n`);
    return;
  }

  process.stdout.write(body);
  if (!body.endsWith("\n")) process.stdout.write("\n");
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isCli) {
  main();
}
