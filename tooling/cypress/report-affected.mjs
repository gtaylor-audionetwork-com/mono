#!/usr/bin/env node
/**
 * Prints (and optionally writes to GITHUB_STEP_SUMMARY) which Cypress specs
 * would run for this branch. CI uses the same plan to run lightweight pipeline tests.
 */
import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAffectedPlan } from "./select-affected-specs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

function parseBase(argv) {
  const index = argv.indexOf("--base");
  if (index === -1) return "origin/main";
  return argv[index + 1] ?? "origin/main";
}

function banner(title) {
  const line = "═".repeat(Math.max(title.length + 4, 52));
  return `\n${line}\n  ${title}\n${line}`;
}

function formatList(items, emptyLabel) {
  if (items.length === 0) return emptyLabel;
  return items.map((item) => `  • ${item}`).join("\n");
}

function writeStepSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  appendFileSync(summaryPath, markdown);
}

function main() {
  const base = parseBase(process.argv.slice(2));
  const { changedFiles, cypressSpecs, skippedCypressSpecs, pipelineTests } = getAffectedPlan(base);

  let changedBlock =
    changedFiles.length > 0
      ? formatList(changedFiles.slice(0, 40), "  (no committed diff vs base — smoke targeting)")
      : "  (no committed diff vs base — smoke targeting)";
  if (changedFiles.length > 40) {
    changedBlock += `\n  … and ${changedFiles.length - 40} more`;
  }

  console.log(banner("Affected test targeting (demo)"));
  console.log("\nChanged paths (git diff vs base):");
  console.log(changedBlock);

  console.log(`\nCypress specs selected (${cypressSpecs.length} of ${cypressSpecs.length + skippedCypressSpecs.length}):`);
  console.log(formatList(cypressSpecs, "  (none)"));

  console.log(`\nCypress specs skipped (${skippedCypressSpecs.length}):`);
  console.log(formatList(skippedCypressSpecs, "  (none)"));

  console.log("\nPipeline checks run in CI (stand-in for Cypress):");
  console.log(formatList(pipelineTests, "  (none)"));
  console.log("");

  const summary = [
    "## Affected test targeting",
    "",
    "This workflow **does not** run Cypress or the Music API on GitHub. It shows which E2E specs **would** run locally, then executes matching **pipeline** unit checks.",
    "",
    "### Changed paths",
    ...(changedFiles.length
      ? changedFiles.slice(0, 30).map((file) => `- \`${file}\``)
      : ["- _No diff vs base — smoke targeting_"]),
    changedFiles.length > 30 ? `- _…and ${changedFiles.length - 30} more_` : "",
    "",
    `### Cypress specs selected (${cypressSpecs.length})`,
    ...cypressSpecs.map((spec) => `- ✅ \`${spec}\``),
    "",
    `### Cypress specs skipped (${skippedCypressSpecs.length})`,
    ...skippedCypressSpecs.map((spec) => `- ⏭️ \`${spec}\``),
    "",
    "### Pipeline checks executed in CI",
    ...pipelineTests.map((test) => `- 🧪 \`${test}\``),
    "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  writeStepSummary(`${summary}\n`);

  if (process.argv.includes("--run-pipeline-tests")) {
    if (pipelineTests.length === 0) {
      console.log("No pipeline tests to run.");
      return;
    }
    const args = pipelineTests.map((relative) => path.join(repoRoot, relative));
    const result = spawnSync("node", ["--test", ...args], { cwd: repoRoot, stdio: "inherit" });
    process.exit(result.status ?? 1);
  }
}

main();
