import { isMatch } from "date-fns";
import { z } from "zod";

export const generateAiReportSchema = z.object({
  period: z.string().refine((value) => isMatch(value, "MM-yyyy")),
});
export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;
