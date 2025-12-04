import { NextResponse } from "next/server";
import * as QRCode from "qrcode"; // 🔥 FIX: Use namespace import

export async function POST(req: Request) {
  try {
    const { content, design } = await req.json();

    // Generate Data URL (Server Side)
    const qr = await QRCode.toDataURL(content || " ", {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 500, // Explicit width is often more reliable than scale on server
      color: {
        dark: design?.color || "#000000",
        light: design?.bgColor || "#ffffff",
      },
    });

    return NextResponse.json({ qr });
  } catch (err: any) {
    console.error("QR Gen Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}