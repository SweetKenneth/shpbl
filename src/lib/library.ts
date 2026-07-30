import vol1 from "@/assets/volume-01-demote-claims.asset.json";
import vol2 from "@/assets/volume-02-substrates-not-features.asset.json";
import vol3 from "@/assets/volume-03-ship-the-crystal.asset.json";
import vol4 from "@/assets/volume-04-software-with-a-soul.asset.json";
import vol5 from "@/assets/volume-05-built-to-be-inherited.asset.json";
import vol6 from "@/assets/volume-06-the-drift-watch.asset.json";
import libraryZip from "@/assets/library-zip.asset.json";
import shelf from "@/assets/shelf.asset.json";
import certSpecimen from "@/assets/certificate-specimen.asset.json";

export const SITE_URL = "https://shpbl.com";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;


export const LIBRARY = {
  title: "The Strategic Master Library",
  subtitle: "Volume Edition",
  edition: "Volume Edition · First Printing · 2026",
  tagline: "Six volumes. One discipline.",
  author: "Kenneth E. Sweet Jr.",
  publisher: "SHPBL.com · Abilene, Texas",
  domain: "SHPBL.com",
  librarySeal: "029909fbe9bd13468ec11dc7ae22f77d39b35d12249c79213b1476c71cde104d",
} as const;

export const ZIP_URL = libraryZip.url;
export const ZIP_BYTES = libraryZip.size;
export const SHELF_URL = shelf.url;

export const CERT_SPECIMEN_URL = certSpecimen.url;

export type Volume = {
  numeral: string;
  n: number;
  title: string;
  message: string;
  epigraph: string;
  drawnFrom: string;
  seal: string;
  /** Raw CDN asset URL (served as a download). */
  url: string;
  /** Stable slug used by the in-browser reader route. */
  slug: string;
  /** In-app reader URL — renders the printable HTML inline. */
  readUrl: string;
};

const VOLUME_SOURCE = [

  {
    numeral: "I",
    n: 1,
    title: "Demote Claims",
    message: "Honest documentation is a moat no one can fork.",
    epigraph: "Demote claims. Do not promote them.",
    drawnFrom:
      "BLDBL · promptfluid/CMPSBL · CMPSBL Bestowal · RSLVBL · BulletSites · AetherionShield · RCRDBL",
    seal: "5612ff08890230f475d8222acf707ef95651e078cd8a018526967cea28491c11",
    url: vol1.url,
  },
  {
    numeral: "II",
    n: 2,
    title: "Substrates, Not Features",
    message: "Own the floor other things stand on.",
    epigraph:
      "Every project is described by what sits below it and what could be built on top.",
    drawnFrom: "CMPSBL · XCTBL³ Space · Space Analytics · AIGVRN · BLDBL · RCKBL · SPLCBL",
    seal: "dc874895f3159859fcb398d52702eb8db213a522b3ef0fc3d9d10cb1c00ae546",
    url: vol2.url,
  },
  {
    numeral: "III",
    n: 3,
    title: "Ship the Crystal",
    message: "Export sealed artifacts. Never export the asset.",
    epigraph: "The substrate stays home; what gets shipped is what gets sold.",
    drawnFrom:
      "CMPSBL Bestowal · Bestowable.com · Restorable · npm & Zenodo distribution · CSAL-1.0",
    seal: "b30970b1e34ae7404421b05a35fe337017b54fb19602979caeeeedb8636ebe53",
    url: vol3.url,
  },
  {
    numeral: "IV",
    n: 4,
    title: "Software with a Soul",
    message: "Taste, naming, and disclosed fiction compound into a moat.",
    epigraph: "Products can carry myth.",
    drawnFrom: "The -BL lexicon · yapFM · RCKBL · SPLCBL · OGs.monster · RSLVBL",
    seal: "dc3036a48bcbf6847db581b85964b89e383fe4de17225d9349788879b05a486f",
    url: vol4.url,
  },
  {
    numeral: "V",
    n: 5,
    title: "Built to Be Inherited",
    message: "Write so a stranger can resume, sell, or sunset your work.",
    epigraph: "Knowledge is Power · Legacy is Wealth · Built to Last.",
    drawnFrom:
      "The owner's-manual format · SimNap OS · Assets & Continuity · CRCKBL · The Canonical & Collapse Registry",
    seal: "ccff21adb34fa3c52a44ebb57d98fefb93bcd40a2079bfe250ef6e8b9558ff02",
    url: vol5.url,
  },
  {
    numeral: "VI",
    n: 6,
    title: "The Drift Watch",
    message: "Standing rules keep a solo founder honest when no one else will.",
    epigraph:
      "This document is a tool for clarity — not a forcing function for monetization.",
    drawnFrom:
      "The founder's standing request · Monetization Roadmap · BulletSites · PTCHBL · RSLVBL · the library itself",
    seal: "ef0c68dc27dab32cc7b6ce0e3eed34f8797dd6187ab1950a000976854a5a5852",
    url: vol6.url,
  },
];

export const VOLUMES: Volume[] = VOLUME_SOURCE.map((v) => {
  const slug = v.url.split("/").pop()!.replace(/\.html$/, "");
  return { ...v, slug, readUrl: `/read/${slug}` };
});

export const VOLUME_BY_SLUG: Record<string, Volume> = Object.fromEntries(
  VOLUMES.map((v) => [v.slug, v]),
);



export const TRUTH_LEGEND = [
  { tag: "CONFIRMED", def: "Directly verifiable in the codebase, database, or shipped product." },
  { tag: "OBSERVED", def: "Present in committed docs, migrations, or memory files; load-bearing intent." },
  { tag: "INFERRED", def: "Synthesized from multiple sources; reasonable but not directly stated." },
  { tag: "PLANNED", def: "Explicit roadmap item, not yet shipped." },
  { tag: "SPECULATIVE", def: "Strategic projection or vision. Not a promise." },
  { tag: "NEEDS CONFIRMATION", def: "A gap; verify before quoting externally." },
];

export const AUTHOR_URL = "https://KESJr.com";
export const COLLECTIVE = "KESJr Collective";
export const ORCID_ID = "0009-0001-4237-1243";
export const ORCID_URL = `https://orcid.org/${ORCID_ID}`;


/** Answered on the landing page and mirrored into FAQPage JSON-LD. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is the Strategic Master Library really free?",
    a: "Yes. All six volumes, the two-stage toolkit, the markdown source, and the deterministic compiler download as one zip at no cost. No email, no account, no upsell.",
  },
  {
    q: "What can I do with it?",
    a: "Read it, print it, archive it, and use it commercially under the Free Edition Grant v1.0. You may redistribute the package whole and unmodified. You may not resell the prose or repackage it as your own.",
  },
  {
    q: "What format are the volumes in?",
    a: "Each volume is a single self-contained HTML file with print CSS built in — open it in any browser, or print to PDF for the boxed set. The toolkit ships as plain markdown patches.",
  },
  {
    q: "What is the seal for?",
    a: "Every volume and the library as a whole carry a SHA-256 seal. The build is deterministic: the same inputs produce byte-identical outputs, so anyone can re-run the compiler and confirm nothing drifted.",
  },
  {
    q: "What is a Certificate of Ownership?",
    a: "A free, numbered, SHA-256 sealed record that your copy exists in the public register. It is provenance, not copy protection — nothing is locked without one.",
  },
  {
    q: "Does the site track me?",
    a: "No third-party trackers, ads, or cookies. Only anonymous first-party counts stored on our own backend, with no personal data and no cross-site identity.",
  },
];
