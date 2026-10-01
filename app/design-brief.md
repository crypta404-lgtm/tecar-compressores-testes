# TecAr — Corporate Industrial Design (v2)

## Audience and intent
Industrial decision makers, engineering leaders and corporate purchasing teams.
Premium, corporate, confident. Every element must explain the offer or move the
visitor to the next step. References: STANQ storefront, layered cut-out heroes
(Mars, Chernobyl, product landing pages), EVE long-form scroll storytelling.

## Visual system (src/tecar-corporate.css)
- Brand colours: TecAr red #d71920 (field and accent), ink #0e0f10, warm white
  #f7f6f3, stone #ecebe7. Photography keeps real colours.
- Red is used as a stage (hero, page heroes, contact band) and as an accent.
- Typography: Inter Tight (display/UI) and Inter (text).
- No rounded corners; hairline rules; one soft radial light on red fields.

## Home, in order, and why each part exists
1. Product stage hero — the three lines a buyer comes for (compressors,
   dryers, rental), each linking to its page. Autoplay 7 s with progress,
   paused on hover/focus/hidden tab/reduced motion. Constant h1 for SEO.
2. Facts — 27 years, 500+ clients, 2 units, Ingersoll Rand (count-up).
3. "O caminho do ar" — sticky original line drawing of a compressed air system
   that draws itself as the visitor reads the five stages (generation,
   treatment, storage/distribution, monitoring, continuity). Shows TecAr owns
   the whole system and routes each stage to its page.
4. Diagnostic questionnaire with the 3-step explanation of what happens next.
5. Company — real Ingersoll Rand installation photo with overlapping card.
6. Services — list that swaps the large image on hover/focus (preview).
7. Port operations photo, scroll film (engine untouched), videos, red contact band.

## Motion rules
- Content is complete in server HTML; reveals only start after hydration
  (html.cx-motion). prefers-reduced-motion disables everything.
- IntersectionObserver only, no scroll listeners.
- Page transitions: router defaultViewTransition (View Transitions API),
  header keeps its place (view-transition-name).

## Images created
- public/assets/corporate/hero-e160.webp, cat-compressor.webp, cat-dryer.webp:
  official Ingersoll Rand photos with the studio background removed.
- public/assets/corporate/og-tecar.jpg: social share card (WhatsApp/LinkedIn).
- The air system schematic is inline SVG in src/components/air-path.tsx.

## Preserved
All routes, contacts, calculators, tables, reports, citations, questionnaire
behaviour and technical data. Scroll-scrub engine and media unchanged.

## Stylesheet order
styles.css → site-v2.css → tecar-editorial.css → tecar-corporate.css.
