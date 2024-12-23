import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not provided" },
        { status: 400 }
      );
    }

    // Fetch issues specific to the user
    const userIssues = await prisma.issue.findMany({
      where: { userEmail: userEmail },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(userIssues, { status: 200 });
  } catch (error) {
    console.error("Error fetching user-specific issues:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user-specific issues",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Issue ID not provided" },
        { status: 400 }
      );
    }

    const deletedIssue = await prisma.issue.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedIssue, { status: 200 });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json(
      {
        error: "Failed to delete issue",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Issue ID not provided" },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updatedIssue = await prisma.issue.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      {
        error: "Failed to update issue",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}
