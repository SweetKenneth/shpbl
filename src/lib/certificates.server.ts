// Server-only certificate minting. Mirrors certify.py byte-for-byte in its
// seal derivation: sha256(library_seal | owner | copy | date).
import { LIBRARY } from "@/lib/library";

export type Certificate = {
  copy_no: number;
  owner: string;
  issue_date: string;
  cert_seal: string;
  library_seal: string;
};

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
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Idempotent: one certificate per registered holder name.
  const existing = await supabaseAdmin
    .from("certificates")
    .select("copy_no, owner, issue_date, cert_seal, library_seal")
    .eq("owner", owner)
    .eq("library_seal", LIBRARY.librarySeal)
    .maybeSingle();
  if (existing.data) return existing.data as Certificate;

  const issueDate = new Date().toISOString().slice(0, 10);

  for (let attempt = 0; attempt < 5; attempt++) {
    const next = await supabaseAdmin.rpc("next_certificate_copy_no" as never);
    let copyNo: number;
    if (!next.error && typeof next.data === "number") {
      copyNo = next.data;
    } else {
      const last = await supabaseAdmin
        .from("certificates")
        .select("copy_no")
        .order("copy_no", { ascending: false })
        .limit(1)
        .maybeSingle();
      copyNo = (last.data?.copy_no ?? 0) + 1;
    }

    const seal = await certSeal(owner, copyNo, issueDate);
    const inserted = await supabaseAdmin
      .from("certificates")
      .insert({
        copy_no: copyNo,
        owner,
        issue_date: issueDate,
        cert_seal: seal,
        library_seal: LIBRARY.librarySeal,
      })
      .select("copy_no, owner, issue_date, cert_seal, library_seal")
      .single();

    if (!inserted.error && inserted.data) return inserted.data as Certificate;
    if (inserted.error && inserted.error.code !== "23505") {
      throw new Error(inserted.error.message);
    }
  }

  throw new Error("Could not assign a copy number. Try again.");
}

export async function findBySeal(seal: string): Promise<Certificate | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("certificates")
    .select("copy_no, owner, issue_date, cert_seal, library_seal")
    .eq("cert_seal", seal)
    .maybeSingle();
  return (data as Certificate) ?? null;
}

export async function recentRegister(limit = 25): Promise<Certificate[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("certificates")
    .select("copy_no, owner, issue_date, cert_seal, library_seal")
    .order("copy_no", { ascending: false })
    .limit(limit);
  return (data as Certificate[]) ?? [];
}
