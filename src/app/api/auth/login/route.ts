import { NextRequest, NextResponse } from "next/server";
import { validateLogin, setAuthCookie } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await validateLogin(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid credentials" },
        { status: 401 }
      );
    }

    await setAuthCookie(result.user.id);

    return NextResponse.json({
      success: true,
      user: { id: result.user.id, email: result.user.email, name: result.user.name },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
