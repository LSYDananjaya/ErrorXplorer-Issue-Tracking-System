import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  // Clear the session cookie
  const cookie = serialize("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1, // Expire the cookie immediately
    path: "/",
  });

  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  response.headers.set("Set-Cookie", cookie);

  return response;
}
