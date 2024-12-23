import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";

const prisma = new PrismaClient();
const sessions: { [key: string]: { userId: number; email: string } } = {};

export async function GET(request: NextRequest) {
  try {
    // Extract cookies from the request
    const cookies = parse(request.headers.get("cookie") || "");
    const sessionData = cookies.session;

    if (!sessionData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, email } = JSON.parse(sessionData);

    if (!sessionId || !sessions[sessionId]) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details from the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Handle the case where the user is not found
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data
    const responseData = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      initials: user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);

    // Provide a clear error message and include stack trace only in development
    return NextResponse.json(
      {
        message: "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && {
          error: (error as any).stack,
        }),
      },
      { status: 500 }
    );
  }
}
