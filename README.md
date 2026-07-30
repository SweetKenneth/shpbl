# SHPBL

SHPBL.com is the publishing house for **The Strategic Master Library — Volume Edition**: six volumes on building software that survives its own success, released free, sealed, and verifiable.

This repository is the site: the reader, the download desk, the certificate registrar, and the public register.

## Why it exists

Most strategy writing is unfalsifiable. It makes claims, ages badly, and leaves no way to check whether the copy you are holding is the copy that was published. The Strategic Master Library takes the opposite position — demote claims, publish the diff, ship the artifact — and the publishing method has to obey the same rule as the text. So every volume is a deterministic build with a printed hash, every download is byte-identical to what the author sealed, and every claim the site makes about provenance can be checked by a reader with a terminal and five minutes. The library is free because a discipline that only works behind a paywall isn't a discipline.

## Reading online

Read the whole library in the browser, no download, no account:

- Library shelf — <https://shpbl.com/read/shelf>
- Volume index — <https://shpbl.com/volumes>
- Volume I — <https://shpbl.com/read/volume-01> … Volume VI — <https://shpbl.com/read/volume-06>

The reader serves the sealed HTML inline. What renders on screen is the same file that ships in the download — same typography, same figures, same colophon, same seal. It prints clean and it works offline once the site is installed as a PWA.

## Downloading a sealed edition

<https://shpbl.com> → **Download the sealed edition** (single ZIP, all six volumes plus the shelf and toolkit).

**Sealed** means three specific things:

1. **Deterministic** — the build produces byte-identical output from the same source. No timestamps, no build IDs, no random ordering.
2. **Hashed** — every volume carries a SHA-256 of its source markdown, printed in its own colophon. The six volume seals fold into one library seal for the edition as a whole:
   `029909fbe9bd13468ec11dc7ae22f77d39b35d12249c79213b1476c71cde104d`
3. **Fixed** — a sealed edition is never silently patched. A correction produces a new build, a new seal, and a note explaining the change. If the hash you compute doesn't match the hash on the page, the file is not the edition.

## Verification

**Source seals** — each volume prints the SHA-256 of the markdown it was rendered from. Recompute it against the source and compare; nothing about the check depends on trusting this site.

**Certificates** — a reader can mint a numbered certificate of provenance at <https://shpbl.com/certificate>. The certificate seal is derived, not random:

```
sha256( librarySeal | owner | copyNumber | issueDate )
```

Same four inputs always produce the same seal, so any certificate can be re-derived and checked independently. A **dry-run / staging mint** derives the exact artifact — copy number, date, seal — without writing to the ledger, and renders with a SPECIMEN watermark.

**Public register** — every issued copy is listed at <https://shpbl.com/certificate> with its number, owner, date, and seal, and each has a permanent verification page at `/certificate/{seal}`. Copy 001 is the Publisher Verification Copy, issued during launch verification before public circulation; it is renamed rather than deleted, because a register that quietly drops rows is not a register.

**Deterministic builds** — the rendering pipeline (`build.py` plus the `figures.py` SVG engine) takes markdown and emits the printable HTML, the shelf, and the ZIP with no nondeterministic input. Rebuild from the same source, get the same bytes, get the same seals.

## Repository

This repo holds the **site**, not the manuscript.

```
src/routes/            pages: landing, volumes, toolkit, license, letter, certificate, register, pulse
src/routes/read.$slug  proxies sealed HTML inline and injects reader chrome
src/lib/library.ts     edition metadata, volume seals, CDN asset URLs
src/lib/certificates.* deterministic certificate derivation + Supabase-backed ledger
src/lib/analytics.*    first-party anonymous counts (no third-party trackers)
public/                robots.txt, llms.txt, security.txt, brand assets, PWA manifest
supabase/              migrations for the certificate register and analytics
```

**Build process.** The library itself is authored in markdown and rendered by a Python pipeline — `build.py` (layout, colophon, seal stamping, ZIP assembly) and `figures.py` (the deterministic SVG diagram engine, two figures per volume). The pipeline emits `dist/`, the sealed HTML files are uploaded to the CDN, and `src/lib/library.ts` is updated with the new seals and asset URLs. That manuscript source and pipeline live with the author's build tree and ship inside the sealed edition; this repository consumes their output.

The site runs on TanStack Start (React 19, Vite 7, Tailwind v4) with a Supabase backend for the register and analytics.

```sh
npm i
npm run dev
```

## Editions

An edition is a fixed point, not a moving document. The current edition is **Volume Edition · First Printing · 2026**.

A new edition is created by: editing the markdown source, rebuilding deterministically, re-deriving every volume seal and the library seal, uploading the new sealed assets, updating `src/lib/library.ts`, and publishing a note describing what changed and why. Existing certificates remain bound to the library seal they were issued against — they stay valid for their edition and are not silently re-pointed at a newer one. Corrections are published as diffs. Nothing is patched in place.

## License

**Free Edition Grant v1.0** — full text at <https://shpbl.com/license> and included in every sealed download.

Free to read, download, print, and share in unmodified sealed form, with attribution. The seals and certificates are provenance instruments: don't alter a sealed file and keep presenting it as the sealed edition.

---

A KESJr Collective Project · [KESJr.com](https://kesjr.com) · Kenneth E. Sweet Jr. · ORCID [0009-0001-4237-1243](https://orcid.org/0009-0001-4237-1243)
