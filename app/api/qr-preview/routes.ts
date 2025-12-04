import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: Request) {
  const { content, design } = await req.json();

  try {
    const qr = await QRCode.toDataURL(content || " ", {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: design?.color || "#000000",
        light: design?.bgColor || "#ffffff",
      },
      // CUSTOM DOT SHAPES (frontend preview only)
      rendererOpts: {
        scale: 10,
      }
    });

    return NextResponse.json({ qr });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
