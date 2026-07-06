import * as z from "zod";

export const gymProfileSchema = z.object({
  gymName: z.string().min(2, "Gym name is required"),
  ownerName: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  gstNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  businessHours: z.string().optional(),
});

export type GymProfileFormValues = z.infer<typeof gymProfileSchema>;

export const membershipPlanSchema = z.object({
  planName: z.string().min(2, "Plan name is required"),
  duration: z.enum(["Monthly", "Quarterly", "Half Yearly", "Yearly"]),
  price: z.number().min(0, "Price must be >= 0"),
  discount: z.number().min(0),
  finalPrice: z.number().min(0),
  description: z.string().optional(),
  color: z.string(),
  displayOrder: z.number(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type MembershipPlanFormValues = z.infer<typeof membershipPlanSchema>;

export const trainerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  specialization: z.string().optional(),
  experienceYears: z.number().min(0),
  joiningDate: z.string().min(1, "Joining date is required"),
  status: z.enum(["Active", "Inactive"]),
});

export type TrainerFormValues = z.infer<typeof trainerSchema>;

export const receiptSettingsSchema = z.object({
  receiptHeader: z.string().optional(),
  receiptFooter: z.string().optional(),
  authorizedSignatureText: z.string(),
  gstNumber: z.string().optional(),
  receiptPrefix: z.string(),
  receiptStartingNumber: z.number().min(1),
  logoPosition: z.enum(["Left", "Center", "Right"]),
  printSize: z.enum(["A4", "Thermal 80mm", "Thermal 58mm"]),
  autoReceiptNumber: z.boolean(),
});

export type ReceiptSettingsFormValues = z.infer<typeof receiptSettingsSchema>;

export const themeSettingsSchema = z.object({
  primaryColor: z.string(),
  sidebarColor: z.string(),
  darkMode: z.boolean(),
  softwareTitle: z.string(),
});

export type ThemeSettingsFormValues = z.infer<typeof themeSettingsSchema>;

export const systemPreferencesSchema = z.object({
  dateFormat: z.string(),
  currencySymbol: z.string(),
  weightUnit: z.enum(["Kg", "Lb"]),
  heightUnit: z.enum(["Cm", "Ft"]),
  timeFormat: z.enum(["12 Hour", "24 Hour"]),
  language: z.enum(["English"]),
});

export type SystemPreferencesFormValues = z.infer<typeof systemPreferencesSchema>;
