import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <Link href="/" className="mb-8 flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#C4A265]">
          <span className="font-heading text-base font-bold tracking-wide text-[#C4A265]">N</span>
          <div className="mx-px h-[26px] w-px bg-[#C4A265]/50" />
          <span className="font-heading text-base font-bold tracking-wide text-[#C4A265]">C</span>
        </div>
        <div>
          <span className="block text-[17px] font-bold uppercase tracking-[0.08em] text-foreground">
            Nortier
          </span>
          <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Cupboards
          </span>
        </div>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
