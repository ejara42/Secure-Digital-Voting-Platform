import React from "react";

export default function Logo({ size=56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-label="Ethiopia election logo">
      <circle cx="100" cy="100" r="96" fill="#fff" stroke="#eee" />
      <path d="M100 12 A88 88 0 0 1 188 100 L150 100 A50 50 0 0 0 100 50 Z" fill="#078000" />
      <path d="M188 100 A88 88 0 0 1 100 188 L100 150 A50 50 0 0 0 150 100 Z" fill="#f7d117"/>
      <path d="M100 188 A88 88 0 0 1 12 100 L50 100 A50 50 0 0 0 100 150 Z" fill="#d52b1e"/>
      <circle cx="100" cy="100" r="48" fill="#fff"/>
      <g transform="translate(82,88)">
        <rect x="0" y="6" width="36" height="24" rx="3" fill="#f3f4f6" stroke="#d0d5db" />
        <rect x="6" y="-18" width="24" height="18" rx="2" fill="#fff" stroke="#bfc7d2" />
      </g>
      <g transform="translate(92,110) rotate(-25)">
        <path d="M0 8 L6 14 L16 2" fill="none" stroke="#078000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}
