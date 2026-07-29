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
  librarySeal: "c645b86426ea6e3ef365d2bbd8db382161356013bc6883bed4fbe28845fdfb1d",
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
  url: string;
};

export const VOLUMES: Volume[] = [
  {
    numeral: "I",
    n: 1,
    title: "Demote Claims",
    message: "Honest documentation is a moat no one can fork.",
    epigraph: "Demote claims. Do not promote them.",
    drawnFrom:
      "BLDBL · promptfluid/CMPSBL · CMPSBL Bestowal · RSLVBL · BulletSites · AetherionShield · RCRDBL",
    seal: "ce44cdc8e8ed32eae67655290d972a84ccdc94a74571840110687df3de912b10",
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
    seal: "31b139c0f4846b4dc92e772c2ffeba5b42c8bdbfda00228488f38157eb5b71ae",
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
    seal: "8936545e4e74b473329a0c68a96e67d3455cca36eb3361e07173cad64679b0fa",
    url: vol3.url,
  },
  {
    numeral: "IV",
    n: 4,
    title: "Software with a Soul",
    message: "Taste, naming, and disclosed fiction compound into a moat.",
    epigraph: "Products can carry myth.",
    drawnFrom: "The -BL lexicon · yapFM · RCKBL · SPLCBL · OGs.monster · RSLVBL",
    seal: "d343a98c70744227e04cb6a5d222200d84fd7065698bf59b7b08bb2040bc4466",
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
    seal: "bb03fcbb9211461c2b03f87f11b102273f3397d6d3b23a26f13dba3168bbd56a",
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
    seal: "5600adb3a45fc55ac4a7c0d6f4229a3f0459aeef2186f88c2e9ce5184b9914c3",
    url: vol6.url,
  },
];

export const TRUTH_LEGEND = [
  { tag: "CONFIRMED", def: "Directly verifiable in the codebase, database, or shipped product." },
  { tag: "OBSERVED", def: "Present in committed docs, migrations, or memory files; load-bearing intent." },
  { tag: "INFERRED", def: "Synthesized from multiple sources; reasonable but not directly stated." },
  { tag: "PLANNED", def: "Explicit roadmap item, not yet shipped." },
  { tag: "SPECULATIVE", def: "Strategic projection or vision. Not a promise." },
  { tag: "NEEDS CONFIRMATION", def: "A gap; verify before quoting externally." },
];
