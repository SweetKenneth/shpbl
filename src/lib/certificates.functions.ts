import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  mintForOwner,
  previewForOwner,
  findBySeal,
  recentRegister,
  normalizeOwner,
} from "@/lib/certificates.server";

export const mintCertificate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        owner: z
          .string()
          .trim()
          .min(2, "Enter the name this copy should be registered to.")
          .max(60, "Sixty characters or fewer."),
      })
      .parse(data),
  )
  .handler(async ({ data }) => mintForOwner(normalizeOwner(data.owner)));

/**
 * Staging mint. Derives the exact certificate a real mint would produce —
 * optionally pinned to a copy number and date — and writes nothing.
 */
export const dryRunCertificate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        owner: z
          .string()
          .trim()
          .min(2, "Enter the name this copy should be registered to.")
          .max(60, "Sixty characters or fewer."),
        copyNo: z.number().int().min(1).max(999).optional(),
        issueDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
          .optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) =>
    previewForOwner(normalizeOwner(data.owner), {
      copyNo: data.copyNo,
      issueDate: data.issueDate,
    }),
  );

export const lookupCertificate = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ seal: z.string().regex(/^[a-f0-9]{64}$/, "Not a certificate seal.") }).parse(data),
  )
  .handler(async ({ data }) => findBySeal(data.seal));

export const listRegister = createServerFn({ method: "GET" }).handler(async () =>
  recentRegister(25),
);
