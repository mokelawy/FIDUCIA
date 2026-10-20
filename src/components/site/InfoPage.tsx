import type { ReactNode } from "react";

export function InfoPage({
  eyebrow,
  title,
  titleAr,
  children,
}: {
  eyebrow: string;
  title: string;
  titleAr?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-background py-14 sm:py-16">
      <div className="mx-auto max-w-[820px] px-6 sm:px-10">
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h1 className="serif-title mt-3 text-3xl sm:text-[2.5rem]">{title}</h1>
        {titleAr && <p className="arabic mt-1 text-sm text-muted-foreground">{titleAr}</p>}
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}

export function InfoBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="border-t border-border pt-5">
      <h2 className="label-xs text-foreground">{heading}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
