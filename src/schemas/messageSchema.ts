import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(8).max(300),
});
