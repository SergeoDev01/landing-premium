import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient
          id="bgremover-logo-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0033ff" />
          <stop offset="1" stopColor="#00a6ff" />
        </linearGradient>
      </defs>
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="9"
        fill="url(#bgremover-logo-grad)"
      />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="9"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <g
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 10v8a4 4 0 0 0 4 4h8" />
        <path d="M24 22v-8a4 4 0 0 0-4-4h-8" />
      </g>
    </svg>
  );
}
