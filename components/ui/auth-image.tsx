"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Optional: Use standard <img> if Next/Image gives trouble with Blobs

export default function AuthImage({ src, alt, className }: any) {
  const [imageSrc, setImageSrc] = useState<string>("/placeholder-qr.png"); // Fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      if (!src) return;

      try {
        const token = localStorage.getItem("token");
        // 1. Fetch the image manually using the Token
        const res = await fetch(src, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // 2. Convert the response to a Blob (Binary Large Object)
          const blob = await res.blob();
          // 3. Create a temporary local URL for the Blob
          const objectURL = URL.createObjectURL(blob);
          setImageSrc(objectURL);
        }
      } catch (err) {
        console.error("Failed to load secure image", err);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [src]);

  return (
    <div className={`relative ${className} overflow-hidden bg-gray-50 flex items-center justify-center`}>
       {/* Use standard img tag for Blob URLs to avoid Next.js domain config issues */}
       <img 
         src={imageSrc} 
         alt={alt} 
         className="w-full h-full object-contain" 
       />
    </div>
  );
}