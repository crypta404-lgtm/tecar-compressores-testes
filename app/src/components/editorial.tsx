import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/*
 * Editorial building blocks for the content pages (Serviços, Safety Air...).
 * Same language as the "A TecAr" page: generous space, light surfaces,
 * rounded cards with breathing room, thin icons, one red accent. Using the
 * same few blocks everywhere keeps the pages consistent and avoids the old
 * grey boxes and loose lists. Styles: ed-* in tecar-corporate.css.
 */

export type Tone = "white" | "paper" | "warm" | "dark";

export function EdSection({ tone = "white", id, children }: { tone?: Tone; id?: string; children: ReactNode }) {
  return <section className="ed-section" data-tone={tone} id={id}><div className="v2-container">{children}</div></section>;
}

/** Section heading. `side` puts the supporting text in a column beside the title. */
export function EdHead({ kicker, title, text, side = false }: { kicker?: string; title: string; text?: string; side?: boolean }) {
  return <div className="ed-head" data-side={side ? "true" : undefined}>
    <div>{kicker && <span className="v2-kicker">{kicker}</span>}<h2>{title}</h2></div>
    {text && <p>{text}</p>}
  </div>;
}

export type EdCard = { icon?: LucideIcon; title: string; text: string; label?: string };

/** Rounded cards with an icon (or a short label such as 01) and a short text. */
export function EdCards({ items, cols = 3 }: { items: EdCard[]; cols?: 2 | 3 | 4 }) {
  return <div className="ed-cards" data-cols={cols}>
    {items.map(({ icon: Icon, title, text, label }) => <article key={title}>
      {Icon ? <span className="ed-icon"><Icon aria-hidden="true" size={22} /></span> : label && <span className="ed-label">{label}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
    </article>)}
  </div>;
}

/** Numbered process with a connecting line. Horizontal on wide screens, vertical on narrow ones. */
export function EdSteps({ steps, vertical = false }: { steps: Array<{ title: string; text?: string }>; vertical?: boolean }) {
  return <ol className="ed-steps" data-vertical={vertical ? "true" : undefined} style={{ ["--ed-n" as string]: steps.length }}>
    {steps.map((s, i) => <li key={s.title}><i>{i + 1}</i><b>{s.title}</b>{s.text && <span>{s.text}</span>}</li>)}
  </ol>;
}

/** Image and copy side by side, image edge to edge with rounded corners. */
export function EdSplit({ image, alt, reverse = false, children }: { image: string; alt: string; reverse?: boolean; children: ReactNode }) {
  return <div className="ed-split" data-reverse={reverse ? "true" : undefined}>
    <figure><img src={image} alt={alt} loading="lazy" /></figure>
    <div className="ed-split-copy">{children}</div>
  </div>;
}

/** Large statement paragraph; `lead` is highlighted in red. */
export function EdStatement({ lead, children }: { lead?: string; children: ReactNode }) {
  return <p className="ed-statement">{lead && <b>{lead} </b>}{children}</p>;
}

/** Big number with a caption. */
export function EdFact({ value, children }: { value: string; children: ReactNode }) {
  return <div className="ed-fact"><strong>{value}</strong><span>{children}</span></div>;
}
