import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-fg hover:text-bg",
  outline: "border border-line text-fg hover:border-fg",
  ghost: "text-fg hover:text-accent",
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: Variant };

/** Link com cara de botão (navegação interna ou externa). */
export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
