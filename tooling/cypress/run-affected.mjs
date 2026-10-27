#!/usr/bin/env node
import { execSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "main";

const specList = execSync(
  `node ${path.join(__dirname, "select-affected-specs.mjs")} --base ${base} --format cypress`,
  { cwd: repoRoot, encoding: "utf8" },
).trim();

if (!specList) {
  console.log("No affected specs; skipping Cypress.");
  process.exit(0);
}

console.log("Running affected Cypress specs:\n" + specList.split(",").join("\n"));

const result = spawnSync(
  "pnpm",
  ["--filter", "@web/host", "exec", "cypress", "run", "--e2e", "--spec", specList],
  { cwd: repoRoot, stdio: "inherit", env: process.env },
);

process.exit(result.status ?? 1);
