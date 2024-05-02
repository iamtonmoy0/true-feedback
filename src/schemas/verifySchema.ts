import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6,{message:"verification code should be minimum 6 characters"}),
});
