/** The recurring olive-sprig motif. Simple, naturalistic — never grapes or vines. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 28"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      {/* central stem */}
      <path d="M6 14 H58" />
      {/* leaves, alternating */}
      <path d="M18 14 c-3 -6 -9 -7 -12 -5 c2 4 8 7 12 5Z" />
      <path d="M30 14 c3 -6 9 -7 12 -5 c-2 4 -8 7 -12 5Z" />
      <path d="M42 14 c-3 6 -9 7 -12 5 c2 -4 8 -7 12 -5Z" />
      <path d="M54 14 c3 6 9 7 12 5 c-2 -4 -8 -7 -12 -5Z" transform="translate(-12 0)" />
      {/* tip leaf */}
      <path d="M58 14 c3 -3 4 -7 3 -10 c-3 2 -5 6 -3 10Z" />
    </svg>
  );
}

/** Circular CANA · GALILEE coin mark — footer mark / favicon / packaging badge. */
export function CoinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <path
          id="coin-top"
          d="M60 60 m-44 0 a44 44 0 1 1 88 0"
        />
        <path
          id="coin-bottom"
          d="M60 60 m44 0 a44 44 0 1 1 -88 0"
        />
      </defs>
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="47" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      <text
        fill="currentColor"
        style={{ fontFamily: "var(--font-serif), serif", letterSpacing: "0.22em" }}
        fontSize="11"
      >
        <textPath href="#coin-top" startOffset="50%" textAnchor="middle">
          CANA
        </textPath>
      </text>
      <text
        fill="currentColor"
        style={{ fontFamily: "var(--font-serif), serif", letterSpacing: "0.22em" }}
        fontSize="9"
        opacity="0.75"
      >
        <textPath href="#coin-bottom" startOffset="50%" textAnchor="middle">
          GALILEE
        </textPath>
      </text>
      {/* small central sprig */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" transform="translate(40 56)">
        <path d="M0 4 H40" />
        <path d="M12 4 c-2 -4 -6 -5 -8 -3 c1.5 3 5 4.5 8 3Z" />
        <path d="M22 4 c2 -4 6 -5 8 -3 c-1.5 3 -5 4.5 -8 3Z" />
      </g>
    </svg>
  );
}
