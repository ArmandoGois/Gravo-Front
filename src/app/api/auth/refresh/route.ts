import { NextResponse, type NextRequest } from "next/server";

/**
 * API Route for refresh token
 * Cookies are sent automatically with the request
 */
export async function POST(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await response.json();

    // Get new cookies from backend
    const setCookieHeader = response.headers.get("set-cookie");

    const nextResponse = NextResponse.json(data);

    // Forward new cookies to client
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
