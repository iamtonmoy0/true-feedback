import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const result = await UserModel.find({ username: decodedUsername });
    if (!result) {
      return Response.json(
        {
          success: false,
          message: "No user found",
        },
        { status: 500 }
      );
    }
    const isCodeValid = result.verifyCode === code;
    const isCodeNotExpired = new Date(result.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      result.isVerified = true;
      await result.save();
      return Response.json(
        {
          success: true,
          message: "User is Verified",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code is expired",
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect  verification Code",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to verify code",
      },
      { status: 500 }
    );
  }
}
