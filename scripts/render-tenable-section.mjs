#!/usr/bin/env node
/**
 * Renders the CyberAgents Exchange table in README.md from TENABLE-LISTINGS.json.
 *
 * The table between the two markers is generated. Add or update a row in the
 * JSON and re-run; never hand-edit the table. Wording of the surrounding claims
 * is deliberate and lives in the README, not here.
 *
 *   node scripts/render-tenable-section.mjs          # write
 *   node scripts/render-tenable-section.mjs --check  # fail if stale (CI)
 */
import { readFileSync, writeFileSync } from "node:fs";

const START = "<!-- TENABLE-TABLE:START -->";
const END = "<!-- TENABLE-TABLE:END -->";

const data = JSON.parse(readFileSync("TENABLE-LISTINGS.json", "utf8"));
const owner = data.owner;
const exchangeRepo = data.exchange.repo;

const STATE = {
  accepted: "accepted",
  submitted: "submitted, under review",
};

const rows = data.listings
  .slice()
  .sort((a, b) => a.pr - b.pr)
  .map((l) => {
    const impl = `[\`${l.repo}\`](https://github.com/${owner}/${l.repo})`;
    const pr = `[#${l.pr}](${exchangeRepo}/pull/${l.pr})`;
    const listing = l.listing
      ? `[listing](${exchangeRepo}/blob/main/${l.listing})`
      : "—";
    const spec = l.spec
      ? `[spec](https://github.com/${owner}/${l.spec})`
      : "in-repo";
    return `| ${l.title} | ${impl} | ${spec} | ${pr} | ${STATE[l.state] ?? l.state} | ${listing} |`;
  });

const accepted = data.listings.filter((l) => l.state === "accepted").length;

const table = [
  START,
  "",
  `_Generated from \`TENABLE-LISTINGS.json\` — ${accepted} accepted, ${data.listings.length} submitted in total._`,
  "",
  "| Capability | Implementation repository | Behaviour specification | Submission | Review state | Published listing |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows,
  "",
  END,
].join("\n");

const readme = readFileSync("README.md", "utf8");
const a = readme.indexOf(START);
const b = readme.indexOf(END);
if (a === -1 || b === -1) {
  console.error(`README.md is missing ${START} / ${END}`);
  process.exit(1);
}
const next = readme.slice(0, a) + table + readme.slice(b + END.length);

if (process.argv.includes("--check")) {
  if (next !== readme) {
    console.error("README.md Tenable table is stale — run: node scripts/render-tenable-section.mjs");
    process.exit(1);
  }
  console.log("README.md Tenable table is current.");
} else {
  writeFileSync("README.md", next);
  console.log(`Rendered ${rows.length} listing rows into README.md.`);
}
