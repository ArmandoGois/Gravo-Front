import { NextResponse } from "next/server";

/**
 * API Route to handle login
 *
 * This endpoint acts as a proxy to the real backend.
 * The backend should set httpOnly cookies in the response.
 *
 * IMPORTANT: This is an example. In production, this endpoint
 * should make the real request to your backend and propagate cookies.
 */
export async function POST(request: Request) {
  try {
    const credentials = await request.json();

    // Make the real request to your backend
    const backendUrl =
      process.env.NEXT_PUBLIC_GRAVO_API_URL || "http://localhost:3001/api";

    const response = await fetch(`${backendUrl}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // Important to receive cookies from backend
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Login error" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Create response and propagate cookies from backend
    const nextResponse = NextResponse.json(data);

    // Copy cookies from backend to Next.js response
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
