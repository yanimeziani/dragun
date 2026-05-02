// Dragun brand mark + wordmark.
//
// Icon: /public/dragun-icon.svg — the file already bakes in ember (#FF6A1A),
// which matches the dark-bg spec. Use <DragunMark> when only the icon is
// wanted, <DragunLogo> when the "Dragun" wordmark in Lora should follow.
//
// Sizing: pass a Tailwind class via `className` (default h-5 w-5). The mark
// keeps a square aspect-ratio; the wordmark inherits font-size from its
// container, so set text-* on the wrapper.

type MarkProps = {
  className?: string;
  alt?: string;
};

export function DragunMark({
  className = "h-5 w-5",
  alt = "Dragun",
}: MarkProps) {
  // Static brand SVG → plain <img> is the Next.js-recommended pattern; the
  // image optimizer doesn't process SVG and `next/image` would require
  // `dangerouslyAllowSVG`. Eslint rule is disabled inline.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/dragun-icon.svg"
      alt={alt}
      className={`${className} shrink-0 select-none`}
      aria-hidden={alt === ""}
      draggable={false}
    />
  );
}

type LogoProps = MarkProps & {
  wordmarkClassName?: string;
  /** Optional subline rendered to the right of the wordmark (e.g. "™ · Get paid"). */
  tagline?: React.ReactNode;
  taglineClassName?: string;
};

export function DragunLogo({
  className = "h-5 w-5",
  wordmarkClassName = "text-lg sm:text-xl",
  tagline,
  taglineClassName = "hidden xl:inline font-mono text-[11.5px] uppercase tracking-[0.22em] text-bone-3",
  alt = "",
}: LogoProps) {
  return (
    <span className="flex items-center gap-2 sm:gap-3 text-bone min-w-0">
      <DragunMark className={className} alt={alt} />
      <span
        className={`font-brand font-medium tracking-tight leading-none ${wordmarkClassName}`}
      >
        Dragun
      </span>
      {tagline ? <span className={taglineClassName}>{tagline}</span> : null}
    </span>
  );
}
