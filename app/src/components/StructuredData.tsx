/**
 * SSR-safe JSON-LD structured data component.
 * Place at the top of page JSX, before visible content.
 * The `json` prop must be a pre-stringified JSON string (module-level const).
 */
export function StructuredData({ json }: { json: string }) {
  const safeJson = json.replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson }} />;
}
