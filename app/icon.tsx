import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shape (Rounded Square) - Blue-600 */}
          <rect x="2" y="2" width="28" height="28" rx="8" fill="#2563eb" />
          
          {/* The "Beam" (Light Ray cutting through) */}
          <path 
            d="M20 2L10 30" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          
          {/* QR Dots (Abstracted) */}
          <rect x="7" y="10" width="3" height="3" rx="1" fill="white" fillOpacity="0.9" />
          <rect x="7" y="18" width="3" height="3" rx="1" fill="white" fillOpacity="0.9" />
          <rect x="22" y="10" width="3" height="3" rx="1" fill="white" fillOpacity="0.9" />
          
          {/* Sparkle/Active Dot - Blue-200 */}
          <circle cx="21.5" cy="20.5" r="2.5" fill="#bfdbfe" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}