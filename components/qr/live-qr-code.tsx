"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

const LiveQRCode = forwardRef(({ content, design, watermark = false }: any, ref) => {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const qr = useRef(
    new QRCodeStyling({
      width: 300,
      height: 300,
      type: "canvas",
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4
      },
    })
  ).current;

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (design.logo instanceof File) {
      // Handle User Uploaded File
      const url = URL.createObjectURL(design.logo);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof design.logo === "string") {
      // Handle Static URL (Watermark)
      setLogoUrl(design.logo);
    } else {
      setLogoUrl("");
    }
  }, [design.logo]);

  useEffect(() => {
    qr.update({
      data: content,
      dotsOptions: { type: design.dotShape, color: design.color },
      backgroundOptions: { color: design.bgColor },
      cornersSquareOptions: { type: design.eyeShape, color: design.color },
      cornersDotOptions: { type: design.eyeShape, color: design.color },
      image: logoUrl,
    });
  }, [content, design, logoUrl, qr]);

  useImperativeHandle(ref, () => ({
    async download(format: "png" | "jpeg" = "png") {
      // 1. If no watermark needed, download raw QR
      if (!watermark) {
          await qr.download({ name: "qr-code", extension: format });
          return;
      }

      // 2. Watermark Logic: Composite QR + Text on a new Canvas
      const blob = await qr.getRawData(format);
      if (!blob) return;
      
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      
      img.onload = () => {
           const canvas = document.createElement("canvas");
           const ctx = canvas.getContext("2d");
           const padding = 40;
           const footerHeight = 60;
           
           // Resize canvas to fit QR + Footer
           canvas.width = img.width + (padding * 2);
           canvas.height = img.height + (padding * 2) + footerHeight;

           if (ctx) {
               // Fill Background (White)
               ctx.fillStyle = "#ffffff";
               ctx.fillRect(0, 0, canvas.width, canvas.height);

               // Draw the QR Code centered
               ctx.drawImage(img, padding, padding);

               // Draw "Powered by Beam" Text
               ctx.font = "bold 20px sans-serif";
               ctx.fillStyle = "#9CA3AF"; // Gray color
               ctx.textAlign = "center";
               ctx.textBaseline = "middle";
               
               // Footer Text Position
               const centerX = canvas.width / 2;
               const footerY = canvas.height - (footerHeight / 2);
               
               ctx.fillText("POWERED BY BEAM", centerX, footerY);
           }

           // Trigger Download
           const link = document.createElement("a");
           link.download = `qr-code-beam.${format}`;
           link.href = canvas.toDataURL(`image/${format}`);
           link.click();
           
           // Cleanup
           URL.revokeObjectURL(img.src);
       };
    },
  }));

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        ref={qrRef} 
        className="overflow-hidden rounded-xl bg-white"
        style={{ backgroundColor: design.bgColor }} 
      />
    </div>
  );
});

LiveQRCode.displayName = "LiveQRCode"; 

export default LiveQRCode;