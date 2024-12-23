// app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sessions } from "./sessionStore"; // Adjust the import path to where your sessionStore.ts is located

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value;
  if (!cookie || !sessions[cookie]) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // If session exists, return user data
  return NextResponse.json(
    { message: "Authenticated", user: sessions[cookie] },
    { status: 200 }
  );
}
