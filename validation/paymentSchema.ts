import * as z from "zod";

export const paymentSchema = z.object({
  membershipId: z.string().uuid("Invalid membership ID"),
  memberId: z.string().uuid("Invalid member ID"),
  amountPaid: z.number().min(1, "Amount paid must be greater than 0"),
  discount: z.number().min(0),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionReference: z.string().optional(),
  remarks: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
