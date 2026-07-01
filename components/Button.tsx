import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-md font-sans font-medium tracking-wide transition-colors transition-transform duration-200 ease-out min-h-[44px] px-7 py-3 text-[0.95rem] focus-visible:outline-olive";

const variants: Record<Variant, string> = {
  primary:
    "bg-umber text-bone hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0",
  secondary:
    "border border-umber/60 text-umber hover:border-umber hover:bg-umber/5",
};

type ButtonAsLink = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

/** Links rendered as buttons (the site has no real <button> actions besides the FAQ + form). */
export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
  external,
}: ButtonAsLink) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a href={href} className={cn(base, variants[variant], className)} {...externalProps}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
