import { NextResponse } from "next/server";

/**
 * API Route to handle logout
 *
 * This endpoint acts as a proxy to the real backend.
 * The backend should remove httpOnly cookies.
 */
export async function POST(request: Request) {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    const response = await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Propagate cookies from client to backend
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const nextResponse = NextResponse.json({ success: true });

    // Propagate deletion cookies from backend
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
