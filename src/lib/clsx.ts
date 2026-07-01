// Minimal className joiner (no external dep)
export function clsx(
  ...args: Array<string | false | null | undefined>
): string {
  return args.filter(Boolean).join(" ");
}
