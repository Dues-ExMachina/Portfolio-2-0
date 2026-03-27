import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.FASTAPI_URL;
        console.log("NEXT.JS IS ATTEMPTING TO FETCH:", `${backendUrl}/generate`); // <--- ADD THIS
        if (!backendUrl) {
            return NextResponse.json(
                { error: "FASTAPI_URL not configured" },
                { status: 500 }
            );
        }

        // Use AbortController with a 120s timeout to prevent infinite hangs
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        try {
            const response = await fetch(`${backendUrl}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            // Forward the backend's status code if it's an error
            if (!response.ok) {
                return NextResponse.json(
                    { error: data.error || "Backend returned an error" },
                    { status: response.status }
                );
            }

            return NextResponse.json(data);

        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);

            if (fetchError instanceof Error && fetchError.name === "AbortError") {
                return NextResponse.json(
                    { error: "Request timed out. The generation took too long." },
                    { status: 504 }
                );
            }

            // Backend is unreachable
            return NextResponse.json(
                { error: "Cannot connect to the backend server. Is FastAPI running on port 8000?" },
                { status: 502 }
            );
        }

    } catch (error) {
        console.error("Generate error:", error);

        return NextResponse.json(
            { error: "Failed to process drawing" },
            { status: 500 }
        );
    }
}