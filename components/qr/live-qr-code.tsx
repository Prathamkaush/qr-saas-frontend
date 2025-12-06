"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";

// Blue Beam Logo for the Watermark Footer
const WATERMARK_LOGO_SRC = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI4IiBmaWxsPSIjMjU2M2ViIi8+PHBhdGggZD0iTTIwIDJMMTAgMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHJlY3QgeD0iNyIgeT0iMTAiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjkiLz48cmVjdCB4PSI3IiB5PSIxOCIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPjxyZWN0IHg9IjIyIiB5PSIxMCIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPj48Y2lyY2xlIGN4PSIyMS41IiBjeT0iMjAuNSIgcj0iMi41IiBmaWxsPSIjYmZkYmZlIi8+PC9zdmc+`;

const LiveQRCode = forwardRef(({ content, design, watermark = false }: any, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrInstance = useRef<any>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Default size for the preview container
  const size = design?.previewSize || 280;

  // 1. Initialize Client-Side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Load Library & Create Instance
  useEffect(() => {
    if (!isMounted) return;

    const initQR = async () => {
      const QRCodeStyling = (await import("qr-code-styling")).default;

      if (!qrInstance.current) {
        qrInstance.current = new QRCodeStyling({
          width: size,
          height: size,
          type: "canvas",
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 5,
            imageSize: 0.4,
          },
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          qrInstance.current.append(containerRef.current);
        }
      }
      updateQR();
    };

    initQR();
  }, [isMounted]);

  // 3. Handle Logo File/URL
  useEffect(() => {
    if (design?.logo instanceof File) {
      const url = URL.createObjectURL(design.logo);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof design?.logo === "string") {
      setLogoUrl(design.logo);
    } else {
      setLogoUrl("");
    }
  }, [design?.logo]);

  // 4. Update Logic (Styles & Content)
  const updateQR = () => {
    if (!qrInstance.current) return;

    qrInstance.current.update({
      width: size,
      height: size,
      data: content,
      backgroundOptions: { color: design?.bgColor || "#ffffff" },
      
      dotsOptions: { 
        type: design?.dotShape || "square", 
        color: design?.color || "#000000"
      },
      
      cornersSquareOptions: { 
        type: design?.eyeShape || "square", 
        color: design?.color || "#000000"
      },
      
      cornersDotOptions: { 
        type: design?.eyeShape || "square", 
        color: design?.color || "#000000"
      },

      image: logoUrl,
    });
  };

  // Trigger update on prop change
  useEffect(() => {
    updateQR();
  }, [content, design, logoUrl, size]);

  // 5. Download Logic (With Watermark Support)
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
        // Get raw QR image blob
        const blob = await qrInstance.current.getRawData(format);
        if (!blob) return;
        
        const qrUrl = URL.createObjectURL(blob);

        const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        // Load both QR and Logo in parallel
        const [qrImg, logoImg] = await Promise.all([
            loadImage(qrUrl),
            loadImage(WATERMARK_LOGO_SRC)
        ]);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const padding = 40;
        const footerHeight = 70;
        
        // Set canvas size
        canvas.width = qrImg.width + (padding * 2);
        canvas.height = qrImg.height + (padding * 2) + footerHeight;

        if (ctx) {
            // White Background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw QR
            ctx.drawImage(qrImg, padding, padding);

            // Draw Footer Elements
            const centerX = canvas.width / 2;
            const footerY = canvas.height - (footerHeight / 2);
            const iconSize = 24;

            // 1. Draw Logo Icon
            ctx.drawImage(logoImg, centerX - 90, footerY - (iconSize/2), iconSize, iconSize);

            // 2. Draw Text
            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#111827";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("Powered by Beam", centerX - 55, footerY);
        }

        // Trigger Download
        const link = document.createElement("a");
        link.download = `qr-code-beam.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(qrUrl);

      } catch (e) {
        console.error("Download failed", e);
      }
    }
  }));

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        ref={containerRef}
        className="rounded-xl shadow flex items-center justify-center"
        style={{
          backgroundColor: design?.bgColor || "#ffffff",
          // Add slight padding to container so QR isn't flush with edge
          padding: "10px", 
        }}
      />
    </div>
  );
});

LiveQRCode.displayName = "LiveQRCode";

export default LiveQRCode;