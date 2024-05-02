import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request, response: Response) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }
    // phase 2
    const userExistByEmail = await UserModel.findOne({ email });
    // verify code
    const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (userExistByEmail) {
      // if user exist with this email
      if (userExistByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userExistByEmail.password = hashedPassword;
        userExistByEmail.verifyCode = verifyCode;
        userExistByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await userExistByEmail.save();
      }
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      //   create new user
      const newUser = await new UserModel({
        username,
        email,
        password: hashedPass,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    // send verification mail
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    // check is response is error
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, "error registering user");
    return Response.json({
      success: false,
      error,
    });
  }
}
