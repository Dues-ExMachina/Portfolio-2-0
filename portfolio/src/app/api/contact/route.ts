import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Try to send via Resend if API key is set
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey && apiKey !== "re_placeholder") {
            const { Resend } = await import("resend");
            const resend = new Resend(apiKey);
            await resend.emails.send({
                from: "Portfolio Contact <onboarding@resend.dev>",
                to: ["anubhabd45@gmail.com"],
                subject: subject || `New contact from ${name}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
            });
        }

        // Always return success (form is functional even without Resend key)
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
