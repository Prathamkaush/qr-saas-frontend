"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

const LiveQRCode = forwardRef(({ content, design }: any, ref) => {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  // 1. Initialize the library once
  const qr = useRef(
    new QRCodeStyling({
      width: 300,
      height: 300,
      type: "canvas", // 'svg' or 'canvas'
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4 // Adjust logo size relative to QR
      },
    })
  ).current;

  // 2. Append to DOM (Fixing the Double-Render Bug)
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = ""; // 🔥 FIX: Clear duplicate QRs
      qr.append(qrRef.current);
    }
  }, []);

  // 3. Handle Logo Memory Leaks
  // Only create a new URL when the FILE actually changes, not on every render
  useEffect(() => {
    if (design.logo instanceof File) {
      const url = URL.createObjectURL(design.logo);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup memory
    } else {
      setLogoUrl("");
    }
  }, [design.logo]);

  // 4. Update QR Appearance
  useEffect(() => {
    qr.update({
      data: content,
      dotsOptions: { 
        type: design.dotShape, 
        color: design.color 
      },
      backgroundOptions: { 
        color: design.bgColor 
      },
      cornersSquareOptions: { 
        type: design.eyeShape, 
        color: design.color 
      },
      cornersDotOptions: { 
        type: design.eyeShape, 
        color: design.color 
      },
      image: logoUrl, // Use the managed URL
    });
  }, [content, design, logoUrl, qr]);

  // 5. Expose Download Function
  useImperativeHandle(ref, () => ({
    async download(format: "png" | "jpeg" | "svg" = "png") {
      // For SVG/JPEG/PNG download
      await qr.download({ 
          name: "qr-code", 
          extension: format 
      });
    },
  }));

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Container with styling */}
      <div 
        ref={qrRef} 
        className="overflow-hidden rounded-xl bg-white"
        style={{ 
            // Optional: Match the user's chosen bg color for seamless look
            backgroundColor: design.bgColor 
        }} 
      />
    </div>
  );
});

// Required for forwardRef in Next.js
LiveQRCode.displayName = "LiveQRCode"; 

export default LiveQRCode;