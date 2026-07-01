import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  id,
  children,
  className,
  containerClassName,
  bleed = false,
  labelledBy,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** full-bleed: skip the inner Container (e.g. hero) */
  bleed?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-20 sm:py-24 lg:py-32", className)}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}

/** The recurring section opener: a short gold rule, then a serif heading, then sans intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "block h-px w-12 bg-gold/70",
          align === "center" ? "mx-auto" : "",
        )}
      />
      {eyebrow ? (
        <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-wide2 text-olive">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-4 font-serif text-h2 font-medium text-umber"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-espresso/80">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
