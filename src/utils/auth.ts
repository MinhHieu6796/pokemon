import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "pokemon_auth_token";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Simple token generation (in production, use a proper JWT or crypto library)
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Demo users for testing (in production, use a real database)
const DEMO_USERS: Array<{ id: string; email: string; password: string; name: string }> = [
  { id: "1", email: "admin@pokemon.com", password: "admin123", name: "Admin Trainer" },
  { id: "2", email: "user@pokemon.com", password: "user123", name: "Ash Ketchum" },
];

export async function setAuthCookie(userId: string): Promise<void> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  const cookieStore = await cookies();

  // Store session data (in production, store in database/Redis)
  const sessionData = JSON.stringify({
    userId,
    token,
    expiresAt: expiresAt.toISOString(),
  });

  cookieStore.set(AUTH_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const sessionData = await getAuthCookie();
  if (!sessionData) return false;

  try {
    const session = JSON.parse(sessionData);
    const isExpired = new Date(session.expiresAt) < new Date();
    return !isExpired;
  } catch {
    return false;
  }
}

export async function getCurrentUser(): Promise<{ id: string; email: string; name: string } | null> {
  const sessionData = await getAuthCookie();
  if (!sessionData) return null;

  try {
    const session = JSON.parse(sessionData);
    const isExpired = new Date(session.expiresAt) < new Date();
    if (isExpired) return null;

    const user = DEMO_USERS.find((u) => u.id === session.userId);
    if (!user) return null;

    return { id: user.id, email: user.email, name: user.name };
  } catch {
    return null;
  }
}

export async function validateLogin(email: string, password: string): Promise<{ success: boolean; user?: { id: string; email: string; name: string }; error?: string }> {
  const user = DEMO_USERS.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  if (user.password !== password) {
    return { success: false, error: "Invalid email or password" };
  }

  return {
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
  };
}
