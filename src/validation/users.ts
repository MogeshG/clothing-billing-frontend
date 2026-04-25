import { z } from "zod";

const phoneRegex = /^[0-9]{10}$/;

const permissionFlagsSchema = z.object({
  create: z.boolean(),
  read: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
});

export const permissionsSchema = z.record(permissionFlagsSchema).optional();

const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().regex(phoneRegex, "Phone must be exactly 10 digits"),
  email: z.preprocess((val) => {
    if (val === "" || val === null) return undefined;
    return val;
  }, z.string().email("Invalid email").optional()),
  password: z.preprocess(
    (val) => {
      if (val === "" || val === null) return undefined;
      return val;
    },
    z.string().min(6, "Password must be at least 6 characters"),
  ),
  confirmPassword: z.preprocess(
    (val) => {
      if (val === "" || val === null) return undefined;
      return val;
    },
    z.string().min(6, "Confirm Password must be at least 6 characters"),
  ),
  permissions: permissionsSchema,
});

export const createUserSchema = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  },
);

export const updateUserSchema = baseUserSchema
  .partial()
  .extend({
    password: z.preprocess(
      (val) => {
        if (val === "" || val === null) return undefined;
        return val;
      },
      z.string().min(6, "Password must be at least 6 characters").optional(),
    ),
    confirmPassword: z.preprocess(
      (val) => {
        if (val === "" || val === null) return undefined;
        return val;
      },
      z.string()
        .min(6, "Confirm Password must be at least 6 characters")
        .optional(),
    ),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .superRefine((data, ctx) => {
    if (data.password !== undefined || data.confirmPassword !== undefined) {
      if (data.password === undefined || data.confirmPassword === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Both password and confirm password are required",
          path: ["confirmPassword"],
        });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords must match",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type UserFormType = z.infer<typeof createUserSchema>;
export type UserUpdateFormType = z.infer<typeof updateUserSchema>;
export type UserPermissionType = z.infer<typeof permissionsSchema>;
