import * as z from "zod";

export const membershipSchema = z.object({
  memberId: z.string().uuid("Invalid member ID"),
  membershipType: z.string().min(1, "Membership type is required"),
  startDate: z.string().min(1, "Start Date is required"),
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
  discount: z.number().min(0, "Discount must be greater than or equal to 0"),
  finalAmount: z.number().min(0, "Final Amount must be greater than or equal to 0"),
});

export type MembershipFormValues = z.infer<typeof membershipSchema>;
