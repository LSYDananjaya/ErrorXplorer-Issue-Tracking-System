import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  fullName: z.string().min(1, "Full name is required"),
  profilePicture: z.string().optional(),
  role: z.enum(["admin", "developer", "tester"]).default("developer"),
  status: z.enum(["active", "inactive", "banned"]).default("active"),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { username, email, password, fullName, profilePicture, role, status } =
    body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      fullName,
      profilePicture,
      role,
      status,
    },
  });

  return NextResponse.json(
    { message: "User registered successfully", newUser },
    { status: 201 }
  );
}
