/**
 * A large, faint olive-branch line illustration — used as a soft watermark
 * behind the hero text. Pure line-art (currentColor), naturalistic, never grapes.
 */
export function OliveBranch({ className }: { className?: string }) {
  const leaf = "M0 0 C 8 -11 8 -24 0 -33 C -8 -24 -8 -11 0 0 Z";
  return (
    <svg
      viewBox="0 0 480 190"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* arching stem */}
      <path d="M24 150 C 150 58, 330 58, 456 150" />

      {/* leaves splaying outward along the arch */}
      <path d={leaf} transform="translate(96.7 109.3) rotate(-52)" />
      <path d={leaf} transform="translate(96.7 109.3) rotate(-18)" />
      <path d={leaf} transform="translate(171.5 87.2) rotate(-32)" />
      <path d={leaf} transform="translate(171.5 87.2) rotate(2)" />
      <path d={leaf} transform="translate(240 81) rotate(-12)" />
      <path d={leaf} transform="translate(240 81) rotate(12)" />
      <path d={leaf} transform="translate(308.5 87.2) rotate(32)" />
      <path d={leaf} transform="translate(308.5 87.2) rotate(-2)" />
      <path d={leaf} transform="translate(383.3 109.3) rotate(52)" />
      <path d={leaf} transform="translate(383.3 109.3) rotate(18)" />

      {/* a few olives */}
      <circle cx="171.5" cy="92" r="4.5" />
      <circle cx="308.5" cy="92" r="4.5" />
      <circle cx="240" cy="66" r="4.5" />
    </svg>
  );
}
