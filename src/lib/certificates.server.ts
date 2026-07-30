// Server-only certificate minting. Mirrors certify.py byte-for-byte in its
// seal derivation: sha256(library_seal | owner | copy | date).
import { LIBRARY } from "@/lib/library";

export type Certificate = {
  copy_no: number;
  owner: string;
  issue_date: string;
  cert_seal: string;
  library_seal: string;
  /** Optional registrar's annotation, e.g. why an issuance was not a normal reader. */
  note: string | null;
};

const COLS = "copy_no, owner, issue_date, cert_seal, library_seal, note";


/** The generated Database types are regenerated asynchronously; keep this
 *  module compiling against the shape we actually rely on. */
type Db = {
  from: (table: string) => any;
};

async function db(): Promise<Db> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as Db;
}

export function normalizeOwner(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 60);
}

export function copyNumber(n: number): string {
  return String(n).padStart(3, "0");
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function certSeal(owner: string, copy: number, date: string) {
  return sha256Hex(`${LIBRARY.librarySeal}|${owner}|${copyNumber(copy)}|${date}`);
}

export async function mintForOwner(owner: string): Promise<Certificate> {
  const sb = await db();

  // Idempotent: one certificate per registered holder name, per edition.
  const existing = await sb
    .from("certificates")
    .select(COLS)
    .eq("owner", owner)
    .eq("library_seal", LIBRARY.librarySeal)
    .maybeSingle();
  if (existing.data) return existing.data as Certificate;

  const issueDate = new Date().toISOString().slice(0, 10);

  for (let attempt = 0; attempt < 6; attempt++) {
    const last = await sb
      .from("certificates")
      .select("copy_no")
      .order("copy_no", { ascending: false })
      .limit(1)
      .maybeSingle();
    const copyNo = (last.data?.copy_no ?? 0) + 1;

    const seal = await certSeal(owner, copyNo, issueDate);
    const inserted = await sb
      .from("certificates")
      .insert({
        copy_no: copyNo,
        owner,
        issue_date: issueDate,
        cert_seal: seal,
        library_seal: LIBRARY.librarySeal,
      })
      .select(COLS)
      .single();

    if (!inserted.error && inserted.data) return inserted.data as Certificate;
    if (inserted.error && inserted.error.code !== "23505") {
      throw new Error(inserted.error.message);
    }
  }

  throw new Error("Could not assign a copy number. Try again.");
}

/** A certificate that was derived but never written to the ledger. */
export type StagedCertificate = Certificate & {
  staging: true;
  /** True when this owner already holds a real, registered certificate. */
  alreadyRegistered: boolean;
};

/**
 * Dry run: derive exactly what `mintForOwner` would produce — same seal
 * derivation, same copy number — without inserting anything. Nothing here
 * touches the public register.
 */
export async function previewForOwner(
  owner: string,
  opts: { copyNo?: number; issueDate?: string } = {},
): Promise<StagedCertificate> {
  const sb = await db();

  const existing = await sb
    .from("certificates")
    .select(COLS)
    .eq("owner", owner)
    .eq("library_seal", LIBRARY.librarySeal)
    .maybeSingle();

  if (existing.data && !opts.copyNo && !opts.issueDate) {
    return { ...(existing.data as Certificate), staging: true, alreadyRegistered: true };
  }

  const issueDate = opts.issueDate ?? new Date().toISOString().slice(0, 10);

  let copyNo: number = opts.copyNo ?? 0;
  if (!copyNo) {
    const last = await sb
      .from("certificates")
      .select("copy_no")
      .order("copy_no", { ascending: false })
      .limit(1)
      .maybeSingle();
    copyNo = (last.data?.copy_no ?? 0) + 1;
  }

  return {
    copy_no: copyNo,
    owner,
    issue_date: issueDate,
    cert_seal: await certSeal(owner, copyNo, issueDate),
    library_seal: LIBRARY.librarySeal,
    note: null,
    staging: true,
    alreadyRegistered: Boolean(existing.data),
  };
}

export async function findBySeal(seal: string): Promise<Certificate | null> {
  const sb = await db();
  const { data } = await sb.from("certificates").select(COLS).eq("cert_seal", seal).maybeSingle();
  return (data as Certificate) ?? null;
}

export async function recentRegister(limit = 25): Promise<Certificate[]> {
  const sb = await db();
  const { data } = await sb
    .from("certificates")
    .select(COLS)
    .order("copy_no", { ascending: false })
    .limit(limit);
  return (data as Certificate[]) ?? [];
}
