import { TECH_SOURCES } from "@/lib/diagnostic-data";

/*
 * Generic compressor profiles for the pré-laudo 360.
 *
 * The visitor describes the machine by power, maximum pressure and control
 * type, so any brand fits (Ingersoll Rand, Atlas Copco, Schulz, ...). Values
 * are typical estimates for lubricated rotary screw packages, calibrated on
 * the CAGI data sheets already used in the site (UP6S 15–22 kW):
 * - package input at full load ≈ 1.15 × motor kW;
 * - flow at up to 8.5 bar ≈ 5.2 cfm per motor kW in small units, rising with
 *   size (larger airends are more efficient);
 * - higher pressure lowers flow at about the same input power
 *   (8.6 → 10.3 bar: −8% flow in the CAGI sheets);
 * - unloaded power ≈ 35% of full load (load/unload) or ≈ 8% (variable speed).
 * When the visitor has nameplate / data sheet values, those replace the
 * estimate (see `customProfile`).
 */

export type Control = "loadUnload" | "vsd";
export type PressureClass = "8" | "10" | "13";
export type FlowUnit = "cfm" | "m3min";

export type CompressorProfile = {
  /** short name used in the summary grid and the WhatsApp text */
  label: string;
  /** one-line description of what the numbers are based on */
  basis: string;
  flowCfm: number;
  packageKw: number;
  noLoadKw: number;
  specificKw100Cfm: number;
  estimated: boolean;
  sourceLabel: string;
  sourceUrl: string;
};

const KW_PER_HP = 0.7456999;
const CFM_PER_M3MIN = 35.3147;

export const POWER_CLASSES = [7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250].map((kw) => ({
  kw,
  hp: Math.round(kw / KW_PER_HP),
}));

export const PRESSURE_CLASSES: Record<PressureClass, { label: string; flowFactor: number }> = {
  "8": { label: "Até 8,5 bar", flowFactor: 1 },
  "10": { label: "Até 10 bar", flowFactor: 0.92 },
  "13": { label: "Até 13 bar", flowFactor: 0.78 },
};

export const CONTROLS: Record<Control, { label: string; noLoadRatio: number }> = {
  loadUnload: { label: "Carga/alívio (velocidade fixa)", noLoadRatio: 0.35 },
  vsd: { label: "Velocidade variável (inversor)", noLoadRatio: 0.08 },
};

const flowPerKw = (kw: number) => (kw <= 22 ? 5.2 : kw <= 55 ? 5.6 : kw <= 132 ? 6 : 6.2);

const fmt = (value: number, digits = 0) => value.toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

export function estimatedProfile(kw: number, pressure: PressureClass, control: Control): CompressorProfile {
  const packageKw = kw * 1.15;
  const flowCfm = kw * flowPerKw(kw) * PRESSURE_CLASSES[pressure].flowFactor;
  const hp = Math.round(kw / KW_PER_HP);
  return {
    label: `Parafuso ${fmt(kw, kw % 1 ? 1 : 0)} kW (${hp} hp) · ${PRESSURE_CLASSES[pressure].label.toLowerCase()} · ${control === "vsd" ? "velocidade variável" : "carga/alívio"}`,
    basis: "Estimativa por faixa de potência (referência CAGI)",
    flowCfm,
    packageKw,
    noLoadKw: packageKw * CONTROLS[control].noLoadRatio,
    specificKw100Cfm: (packageKw / flowCfm) * 100,
    estimated: true,
    sourceLabel: "Estimativa TecAr por faixa de potência, calibrada em fichas CAGI",
    sourceUrl: TECH_SOURCES.cagiVerify.url,
  };
}

export function customProfile(flow: number, unit: FlowUnit, packageKw: number, control: Control): CompressorProfile {
  const flowCfm = unit === "m3min" ? flow * CFM_PER_M3MIN : flow;
  const safeFlow = Math.max(flowCfm, 0.001);
  return {
    label: `Dados da placa/ficha técnica · ${control === "vsd" ? "velocidade variável" : "carga/alívio"}`,
    basis: "Vazão e potência informadas pelo usuário (placa ou ficha técnica)",
    flowCfm,
    packageKw,
    noLoadKw: packageKw * CONTROLS[control].noLoadRatio,
    specificKw100Cfm: (packageKw / safeFlow) * 100,
    estimated: false,
    sourceLabel: "Dados informados pelo usuário",
    sourceUrl: TECH_SOURCES.cagiVerify.url,
  };
}
