import { z } from "zod";

export const emptyToNull = z
  .string()
  .transform((val) => (val === "" ? null : val));
