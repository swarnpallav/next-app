import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (request: NextRequest) => {
  try {
    const userId = await getDataFromToken(request);

    const user = await User.findOne({ userId }).select("-password");

    return NextResponse.json(
      {
        message: "User found!!",
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
};
