import { z } from "zod";

const productBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  sku: z.string().min(1).max(50).optional(),
  hsnCode: z.string().min(1, "HSN code required").max(50),
  description: z.string().max(1000).optional(),

  categoryId: z.string().uuid("Invalid category ID"),

  brand: z.string().max(100).optional(),

  cgstPercent: z
    .number()
    .min(0, "CGST must be >= 0")
    .max(28, "CGST too high")
    .default(0),
  sgstPercent: z
    .number()
    .min(0, "SGST must be >= 0")
    .max(28, "SGST too high")
    .default(0),
  igstPercent: z
    .number()
    .min(0, "IGST must be >= 0")
    .max(28, "IGST too high")
    .default(0),

  taxInclusive: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const createProductSchema = productBaseSchema.refine(
  (data) => !!data.categoryId,
  { message: "Category ID required", path: ["categoryId"] },
);

export const updateProductSchema = productBaseSchema.partial();
