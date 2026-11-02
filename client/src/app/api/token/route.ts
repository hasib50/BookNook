
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";

export async function GET() {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session?.user) {
      return Response.json(
        { token: null, debug: "No active Better Auth session" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return Response.json(
        { message: "JWT_SECRET is missing." },
        { status: 500 }
      );
    }

    const key = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      email: session.user.email,
      name: session.user.name,
      sub: session.user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(key);

    return Response.json(
      { token },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Token generation error:", error);

    return Response.json(
      { message: "Could not generate authentication token." },
      { status: 500 }
    );
  }
}
