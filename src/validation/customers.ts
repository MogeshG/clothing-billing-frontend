import { z } from "zod";

export const createCustomerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    phone: z
      .string()
      .trim()
      .min(10, "Phone must be at least 10 digits")
      .max(15),
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
    address: z
      .string()
      .max(200)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
  })
  .transform((data) => ({
    name: data.name,
    phone: data.phone,
    ...(data.email && { email: data.email }),
    ...(data.address && { address: data.address }),
  }));

export const updateCustomerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
    phone: z
      .string()
      .trim()
      .min(10, "Phone must be at least 10 digits")
      .max(15)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
    address: z
      .string()
      .max(200)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
  })
  .refine((data) => Object.values(data).some(Boolean), {
    message: "At least one field must be changed",
  });

export type CreateCustomerForm = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerForm = z.infer<typeof updateCustomerSchema>;
