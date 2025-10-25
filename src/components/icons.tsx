import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g strokeWidth="3">
        {/* House Outline (lighter brown - using primary color) */}
        <path d="M10 30 L32 10 L54 30" stroke="hsl(var(--primary))" fill="none" />
        <path d="M44 15 V 22 H 49 V 12 L44 15" stroke="hsl(var(--primary))" fill="none" />
        
        {/* Appliances (darker brown - using foreground color) */}
        {/* Refrigerator */}
        <rect x="28" y="24" width="16" height="28" fill="hsl(var(--card))" stroke="currentColor" />
        <line x1="28" y1="34" x2="44" y2="34" stroke="currentColor" />
        <line x1="40" y1="28" x2="40" y2="30" stroke="currentColor" />

        {/* Washing Machine */}
        <rect x="42" y="38" width="16" height="14" fill="hsl(var(--card))" stroke="currentColor" />
        <circle cx="50" cy="45" r="4" fill="none" stroke="currentColor" />
        <circle cx="56" cy="41" r="0.5" fill="currentColor" stroke="currentColor" />
        <circle cx="58" cy="41" r="0.5" fill="currentColor" stroke="currentColor" />
        
        {/* Microwave */}
        <rect x="8" y="36" width="22" height="16" fill="hsl(var(--card))" stroke="currentColor" />
        <rect x="11" y="39" width="12" height="10" fill="none" stroke="currentColor" />
        <circle cx="25" cy="41" r="0.5" fill="currentColor" stroke="currentColor" />
        <circle cx="25" cy="44" r="0.5" fill="currentColor" stroke="currentColor" />
        <circle cx="25" cy="47" r="0.5" fill="currentColor" stroke="currentColor" />
        
        {/* Star (darker brown) */}
        <path d="M46 34 L47.5 31 L49 34 L52 34 L49.5 36 L50.5 39 L48 37 L45.5 39 L46.5 36 L44 34 Z" fill="currentColor" stroke="currentColor"/>

        {/* Base line */}
        <path d="M6 52 H 58" stroke="hsl(var(--primary))" fill="none" />
      </g>
    </svg>
  ),
  height: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M93.75 87.5H6.25V12.5H93.75V87.5Z"
        fill="#F2F2F2"
        stroke="#666666"
        strokeWidth="4"
      />
      <path d="M62.5 87.5H93.75V12.5H62.5V87.5Z" fill="#CCCCCC" />
      <path
        d="M25 25V75"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.25 28.125L25 21.875L18.75 28.125"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.25 71.875L25 78.125L18.75 71.875"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  width: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M93.75 87.5H6.25V12.5H93.75V87.5Z"
        fill="#F2F2F2"
        stroke="#666666"
        strokeWidth="4"
      />
      <path d="M62.5 87.5H93.75V12.5H62.5V87.5Z" fill="#CCCCCC" />
      <path
        d="M18.75 75H81.25"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.875 68.75L15.625 75L21.875 81.25"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M78.125 68.75L84.375 75L78.125 81.25"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  depth: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M93.75 87.5H6.25V12.5H93.75V87.5Z"
        fill="#F2F2F2"
        stroke="#666666"
        strokeWidth="4"
      />
      <path d="M62.5 87.5H93.75V12.5H62.5V87.5Z" fill="#CCCCCC" />
      <path
        d="M50 81.25L87.5 62.5"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43.75 78.125L50 84.375L56.25 78.125"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M81.25 59.375L87.5 65.625L93.75 59.375"
        stroke="#66A84E"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  weight: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M93.75 87.5H6.25V12.5H93.75V87.5Z"
        fill="#F2F2F2"
        stroke="#666666"
        strokeWidth="4"
      />
      <path d="M62.5 87.5H93.75V12.5H62.5V87.5Z" fill="#CCCCCC" />
      <text
        x="34.375"
        y="53.125"
        fontFamily="Arial"
        fontSize="30"
        fontWeight="bold"
        fill="#66A84E"
        textAnchor="middle"
      >
        KG
      </text>
    </svg>
  ),
};