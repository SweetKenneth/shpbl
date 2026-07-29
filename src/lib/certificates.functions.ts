import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  mintForOwner,
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

export const lookupCertificate = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ seal: z.string().regex(/^[a-f0-9]{64}$/, "Not a certificate seal.") }).parse(data),
  )
  .handler(async ({ data }) => findBySeal(data.seal));

export const listRegister = createServerFn({ method: "GET" }).handler(async () =>
  recentRegister(25),
);
