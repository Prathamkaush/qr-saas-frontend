"use client";

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

const LiveQRCode = forwardRef(
  ({ content, design, watermark = false }: any, ref) => {
    const qrRef = useRef<HTMLDivElement | null>(null);

    const [qrInstance, setQrInstance] = useState<any>(null);
    const [QRCodeStyling, setLib] = useState<any>(null);
    const [logoUrl, setLogoUrl] = useState("");

    // ---------------------------
    // Load qr-code-styling library (Client Only)
    // ---------------------------
    useEffect(() => {
      async function loadLib() {
        const lib = (await import("qr-code-styling")).default;
        setLib(() => lib);
      }
      loadLib();
    }, []);

    // ---------------------------
    // Initialize QR once library loads
    // ---------------------------
    useEffect(() => {
      if (!QRCodeStyling) return;

      const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "canvas",
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          imageSize: 0.4,
        },
      });

      setQrInstance(qr);

      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qr.append(qrRef.current);
      }
    }, [QRCodeStyling]);

    // ---------------------------
    // Logo handler (File or URL)
    // ---------------------------
    useEffect(() => {
      if (design?.logo instanceof File) {
        const url = URL.createObjectURL(design.logo);
        setLogoUrl(url);
        return () => URL.revokeObjectURL(url);
      }

      if (typeof design?.logo === "string") {
        setLogoUrl(design.logo);
      } else {
        setLogoUrl("");
      }
    }, [design?.logo]);

    // ---------------------------
    // Apply design + content updates
    // ---------------------------
    useEffect(() => {
      if (!qrInstance) return;

      qrInstance.update({
        data: content,
        dotsOptions: { type: design.dotShape, color: design.color },
        backgroundOptions: { color: design.bgColor },
        cornersSquareOptions: { type: design.eyeShape, color: design.color },
        cornersDotOptions: { type: design.eyeShape, color: design.color },
        image: logoUrl,
      });
    }, [qrInstance, content, design, logoUrl]);

    // ---------------------------
    // Download Handler (with optional watermark)
    // ---------------------------
    useImperativeHandle(ref, () => ({
      async download(format: "png" | "jpeg" = "png") {
        if (!qrInstance) return;

        // No watermark → normal download
        if (!watermark) {
          await qrInstance.download({ name: "qr-code", extension: format });
          return;
        }

        // Watermark ↓
        const blob = await qrInstance.getRawData(format);
        if (!blob) return;

        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const padding = 40;
          const footerHeight = 60;

          canvas.width = img.width + padding * 2;
          canvas.height = img.height + padding * 2 + footerHeight;

          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, padding, padding);

            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#9CA3AF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const centerX = canvas.width / 2;
            const footerY = canvas.height - footerHeight / 2;

            ctx.fillText("POWERED BY BEAM", centerX, footerY);
          }

          const link = document.createElement("a");
          link.download = `qr-code-beam.${format}`;
          link.href = canvas.toDataURL(`image/${format}`);
          link.click();

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
  }
);

LiveQRCode.displayName = "LiveQRCode";

export default LiveQRCode;
