export function BeamLogo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Shape (Rounded Square) */}
      <rect x="2" y="2" width="28" height="28" rx="8" className="fill-blue-600" />
      
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
      
      {/* Sparkle/Active Dot */}
      <circle cx="21.5" cy="20.5" r="2.5" className="fill-blue-200" />
    </svg>
  );
}