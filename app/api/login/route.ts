import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const sessions: { [key: string]: { userId: number; email: string } } = {};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a unique session ID
    const sessionId = uuidv4();

    // Store session data in the in-memory store
    sessions[sessionId] = { userId: user.id, email: user.email };

    // Serialize session data to store in the cookie
    const sessionData = JSON.stringify({ sessionId, email: user.email });

    // Set the session cookie
    const cookie = serialize("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Error during login:", error);

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
