import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); //TODO: remove
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        { success: false, message: "Invalid Parameter" },
        { status: 500 }
      );
    }

    const { username } = result.data;
    const existingVerified = UserModel.find({ username, isVerified: true });
    if (existingVerified) {
      return Response.json({
        success: true,
        message: "User Name already exist",
      });
    }
    return Response.json({ success: true, message: "Username is Unique" });
  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "failed to check username",
      },
      { status: 5000 }
    );
  }
}
