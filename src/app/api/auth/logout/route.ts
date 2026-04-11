import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/utils/auth";

export async function POST(_request: NextRequest) {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
