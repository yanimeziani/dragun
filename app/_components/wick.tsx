export function Wick({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`mb-5 block h-px w-6 bg-gradient-to-r from-ember to-ember/0 ${className}`}
    />
  );
}
