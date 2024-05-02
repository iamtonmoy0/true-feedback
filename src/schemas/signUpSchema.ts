import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username should be minimum 2 character")
  .max(20, "username should me maximum 20 characters");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email" }),
  password: z.string().min(6,{message:"password must me 6 characters"}),
  
});
