"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";

// 1. CONSTANT: Blue Beam Logo for the Watermark Footer
const WATERMARK_LOGO_SRC = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI4IiBmaWxsPSIjMjU2M2ViIi8+PHBhdGggZD0iTTIwIDJMMTAgMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHJlY3QgeD0iNyIgeT0iMTAiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjkiLz48cmVjdCB4PSI3IiB5PSIxOCIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPjxyZWN0IHg9IjIyIiB5PSIxMCIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPj48Y2lyY2xlIGN4PSIyMS41IiBjeT0iMjAuNSIgcj0iMi41IiBmaWxsPSIjYmZkYmZlIi8+PC9zdmc+`;

const LiveQRCode = forwardRef(({ content, design, watermark = false }: any, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrInstance = useRef<any>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // 2. EFFECT: Mark component as mounted (Client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. EFFECT: Dynamic Import & Init (Fixes Vercel Error)
  useEffect(() => {
    if (!isMounted) return;

    const initQR = async () => {
      // 🔥 DYNAMIC IMPORT: This prevents the "self is not defined" error
      const QRCodeStyling = (await import("qr-code-styling")).default;

      if (!qrInstance.current) {
        qrInstance.current = new QRCodeStyling({
          width: 300,
          height: 300,
          type: "canvas",
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 5,
            imageSize: 0.4
          },
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          qrInstance.current.append(containerRef.current);
        }
      }
      // Trigger initial update
      updateQR();
    };

    initQR();
  }, [isMounted]);

  // 4. EFFECT: Handle Logo File/URL
  useEffect(() => {
    if (design.logo instanceof File) {
      const url = URL.createObjectURL(design.logo);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof design.logo === "string") {
      setLogoUrl(design.logo);
    } else {
      setLogoUrl("");
    }
  }, [design.logo]);

  // 5. Helper: Update QR Options
  const updateQR = () => {
    if (!qrInstance.current) return;
    
    qrInstance.current.update({
      data: content,
      dotsOptions: { type: design.dotShape, color: design.color },
      backgroundOptions: { color: design.bgColor },
      cornersSquareOptions: { type: design.eyeShape, color: design.color },
      cornersDotOptions: { type: design.eyeShape, color: design.color },
      image: logoUrl,
    });
  };

  // Update when props change
  useEffect(() => {
    updateQR();
  }, [content, design, logoUrl]);

  // 6. IMPERATIVE HANDLE: Download Logic
  useImperativeHandle(ref, () => ({
    async download(format: "png" | "jpeg" = "png") {
      if (!qrInstance.current) return;

      // A. No Watermark -> Standard Download
      if (!watermark) {
          await qrInstance.current.download({ name: "qr-code", extension: format });
          return;
      }

      // B. Watermark -> Composite Canvas
      try {
        const blob = await qrInstance.current.getRawData(format);
        if (!blob) return;
        
        const qrUrl = URL.createObjectURL(blob);

        // Helper to load image
        const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        // Load QR and Logo together
        const [qrImg, logoImg] = await Promise.all([
            loadImage(qrUrl),
            loadImage(WATERMARK_LOGO_SRC)
        ]);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const padding = 40;
        const footerHeight = 70;
        
        canvas.width = qrImg.width + (padding * 2);
        canvas.height = qrImg.height + (padding * 2) + footerHeight;

        if (ctx) {
            // White Background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw QR
            ctx.drawImage(qrImg, padding, padding);

            // Draw Footer
            const centerX = canvas.width / 2;
            const footerY = canvas.height - (footerHeight / 2);
            const iconSize = 24;

            // Logo Icon (Missing in your code)
            ctx.drawImage(logoImg, centerX - 90, footerY - (iconSize/2), iconSize, iconSize);

            // Text
            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#111827";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("Powered by Beam", centerX - 55, footerY);
        }

        const link = document.createElement("a");
        link.download = `qr-code-beam.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
        URL.revokeObjectURL(qrUrl);

      } catch (e) {
        console.error("Download failed", e);
      }
    },
  }));

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        ref={containerRef} 
        className="overflow-hidden rounded-xl bg-white"
        style={{ backgroundColor: design.bgColor }} 
      />
    </div>
  );
});

LiveQRCode.displayName = "LiveQRCode"; 

export default LiveQRCode;