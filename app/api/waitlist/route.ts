import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    // Por ahora lo guarda en logs (Vercel → Runtime Logs).
    // Luego lo conectamos a MailerLite/ConvertKit/Systeme vía API.
    console.log("WAITLIST_EMAIL:", email);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
