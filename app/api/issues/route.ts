import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const createIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Retrieve user email from request headers
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Create the new issue
    const newIssue = await prisma.issue.create({
      data: {
        title: body.title,
        description: body.description,
        userEmail: userEmail, // Assuming you added `userEmail` to the Issue model
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue", details: (error as any).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const issues = await prisma.issue.findMany();
    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues", details: (error as any).message },
      { status: 500 }
    );
  }
}
