export default function Uhere() {
  const clipId = "uhere-clip";
  const gradId = "uhere-grad";

  return (
    <div className="relative">
      <svg height="60" width="130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* gradient แสง shimmer */}
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* clip ให้ shimmer อยู่ “ใน” path เท่านั้น */}
          <clipPath id={clipId}>
            <path d="M10 50 L30 10 L130 10 L130 30 L30 30 Z" />
          </clipPath>
        </defs>

        {/* Blink only */}
        <circle r="10" cx="10" cy="50" fill="red" className="uhere-blink" />

        {/* Base path (สีพื้น) */}
        <path
          d="M10 50 L30 7 L130 7 L130 30 L30 30 Z"
          fill="red"
          strokeWidth={1}
        />

        <g clipPath={`url(#${clipId})`}>
          <rect
            x="-80"
            y="0"
            width="260"
            height="60"
            fill={`url(#${gradId})`}
            className="uhere-shimmer"
          />
        </g>
      </svg>

      <div className="absolute top-[7.5px] left-[32px] text-nowrap text-white text-[15px]">
        You are here
      </div>

      <style>{`
        .uhere-blink {
          animation: uhereBlink 1s ease-in-out infinite;
        }
        @keyframes uhereBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .uhere-shimmer {
          animation: uhereShimmer 2s ease-in-out infinite;
        }
        @keyframes uhereShimmer {
          0%   { transform: translateX(-120px); }
          100% { transform: translateX(120px); }
        }
      `}</style>
    </div>
  );
}
