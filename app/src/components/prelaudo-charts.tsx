import { money, number, type Opportunity } from "@/lib/prelaudo-opportunities";

/*
 * Charts for the pré-laudo 360. Plain HTML/CSS (no chart library) so they
 * render on the server, print in the PDF and stay light.
 *
 * Colour jobs (validated with the dataviz palette checker on white):
 * - cost breakdown is categorical: useful air in neutral gray (de-emphasis),
 *   waste in red (unload), blue (leaks) and amber (excess pressure);
 * - single-series bars use the brand red;
 * - benchmark meter uses status colours with a text label, never colour alone.
 * Every chart has its numbers in a table or direct labels, and segments carry
 * a native tooltip (title).
 */

export type Segment = { id: string; label: string; value: number };

export function CostBreakdown({ useful, waste, total }: { useful: number; waste: Segment[]; total: number }) {
  const segments: Segment[] = [{ id: "useful", label: "Ar útil para a produção", value: useful }, ...waste];
  const sum = Math.max(total, 0.01);
  return <figure className="pl-chart">
    <figcaption><b>Para onde vai o custo anual de energia</b><span>{money(total)} por ano</span></figcaption>
    <div className="pl-stack" role="img" aria-label={segments.map((s) => `${s.label}: ${money(s.value)}`).join("; ")}>
      {segments.filter((s) => s.value > 0).map((s) => <i key={s.id} data-seg={s.id} style={{ flexGrow: s.value / sum }} title={`${s.label}: ${money(s.value)} (${number((s.value / sum) * 100, 0)}%)`} />)}
    </div>
    <table className="pl-legend-table">
      <tbody>
        {segments.map((s) => <tr key={s.id}><th><i data-seg={s.id} />{s.label}</th><td>{money(s.value)}</td><td>{number((s.value / sum) * 100, 0)}%</td></tr>)}
      </tbody>
    </table>
  </figure>;
}

export function OpportunityBars({ items }: { items: Opportunity[] }) {
  const list = items.filter((item) => item.saving !== null && item.saving > 0).sort((a, b) => (b.saving ?? 0) - (a.saving ?? 0));
  if (!list.length) return null;
  const max = Math.max(...list.map((item) => item.saving ?? 0));
  return <figure className="pl-chart">
    <figcaption><b>Economia por oportunidade</b><span>R$ por ano</span></figcaption>
    <div className="pl-bars">
      {list.map((item) => <div key={item.id} className="pl-bar-row" title={`${item.title}: ${money(item.saving ?? 0)}/ano`}>
        <span>{SHORT_NAMES[item.id] ?? item.title}</span>
        <div><i style={{ width: `${Math.max(3, ((item.saving ?? 0) / max) * 100)}%` }} /><b>{money(item.saving ?? 0)}</b></div>
      </div>)}
    </div>
  </figure>;
}

const SHORT_NAMES: Record<string, string> = {
  unload: "Eliminar tempo em alívio",
  leaks: "Programa de vazamentos",
  setpoint: "Reduzir setpoint",
};

export function BeforeAfter({ today, after }: { today: number; after: number }) {
  const max = Math.max(today, 1);
  const rows = [
    { id: "today", label: "Hoje", value: today },
    { id: "after", label: "Com as melhorias", value: after },
  ];
  return <figure className="pl-chart">
    <figcaption><b>Custo anual de energia</b><span>hoje e com as melhorias identificadas</span></figcaption>
    <div className="pl-bars pl-bars-compare">
      {rows.map((row) => <div key={row.id} className="pl-bar-row" data-row={row.id} title={`${row.label}: ${money(row.value)}/ano`}>
        <span>{row.label}</span>
        <div><i style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }} /><b>{money(row.value)}</b></div>
      </div>)}
    </div>
    <p className="pl-chart-note">Em 5 anos: {money(today * 5)} hoje contra {money(after * 5)} com as melhorias.</p>
  </figure>;
}

const BAND_LABEL = { good: "Eficiente", watch: "Investigar", poor: "Crítico" } as const;

/** Specific power against the usual benchmark: < 21 good, 21–28 investigate, > 28 audit. */
export function SpecificPowerMeter({ value, band }: { value: number; band: "good" | "watch" | "poor" }) {
  const scaleMax = 36;
  const pos = Math.min(100, Math.max(0, (value / scaleMax) * 100));
  return <figure className="pl-chart">
    <figcaption><b>Eficiência do compressor</b><span>potência específica, kW por 100 cfm (menor é melhor)</span></figcaption>
    <div className="pl-meter" role="img" aria-label={`${number(value, 1)} kW/100 cfm: ${BAND_LABEL[band]}`}>
      <div className="pl-meter-track"><i data-band="good" style={{ width: `${(21 / scaleMax) * 100}%` }} /><i data-band="watch" style={{ width: `${(7 / scaleMax) * 100}%` }} /><i data-band="poor" /></div>
      <em style={{ left: `${pos}%` }} />
      <div className="pl-meter-scale"><span>0</span><span style={{ left: `${(21 / scaleMax) * 100}%` }}>21</span><span style={{ left: `${(28 / scaleMax) * 100}%` }}>28</span><span>{scaleMax}+</span></div>
    </div>
    <p className="pl-meter-read" data-band={band}><b>{number(value, 1)} kW/100 cfm</b> · {BAND_LABEL[band]}</p>
  </figure>;
}

export function StatTiles({ tiles }: { tiles: Array<{ label: string; value: string; note?: string; tone?: "risk" | "good" }> }) {
  return <div className="pl-tiles">{tiles.map((tile) => <div key={tile.label} data-tone={tile.tone}><span>{tile.label}</span><b>{tile.value}</b>{tile.note && <small>{tile.note}</small>}</div>)}</div>;
}

export function DataTable({ rows }: { rows: Array<[string, string]> }) {
  return <table className="pl-table"><tbody>{rows.map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}</tbody></table>;
}
