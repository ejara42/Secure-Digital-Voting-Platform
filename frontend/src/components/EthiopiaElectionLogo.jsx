import React from "react";

export default function EthiopiaElectionLogoDark({
  size = 120,
  title = "Ethiopia Online National Election logo (Dark Mode)",
  className = "",
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Background circle with dark gradient */}
      <defs>
        <linearGradient id="gradDark" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#111827" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1f2937" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="96" fill="url(#gradDark)" stroke="#374151" strokeWidth="2" />

      {/* Tricolor arcs (brightened for dark mode) */}
      <path
        d="M100 12 A88 88 0 0 1 188 100 L150 100 A50 50 0 0 0 100 50 Z"
        fill="#16a34a"
      />
      <path
        d="M188 100 A88 88 0 0 1 100 188 L100 150 A50 50 0 0 0 150 100 Z"
        fill="#facc15"
      />
      <path
        d="M100 188 A88 88 0 0 1 12 100 L50 100 A50 50 0 0 0 100 150 Z"
        fill="#dc2626"
      />

      {/* Inner dark circle */}
      <circle cx="100" cy="100" r="48" fill="#1f2937" />

      {/* Ballot box */}
      <g transform="translate(82,88)">
        <rect x="0" y="6" width="36" height="24" rx="3" ry="3" fill="#374151" stroke="#4b5563" strokeWidth="1.5" />
        <rect x="6" y="-18" width="24" height="18" rx="2" ry="2" fill="#111827" stroke="#6b7280" strokeWidth="1.2" />
        {/* slot */}
        <rect x="12" y="-20" width="12" height="3" fill="#9ca3af" rx="1" />
        {/* ballot paper */}
        <rect x="11" y="-14" width="16" height="8" fill="#f9fafb" stroke="#d1d5db" rx="1" transform="rotate(-12 19 -10)" />
      </g>

      {/* Check icon overlay */}
      <g transform="translate(92,110) rotate(-25)">
        <path d="M0 8 L6 14 L16 2" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Text acronym */}
      <text
        x="100"
        y="175"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="10"
        fill="#f9fafb"
        style={{ fontWeight: 600 }}
      >
        ETHIOPIA • ONLINE ELECTION
      </text>
    </svg>
  );
}
