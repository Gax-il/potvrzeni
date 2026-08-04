export type Gender = "dívka" | "chlapec";
export type Currency = "CZK" | "EUR";
export type Preposition = "V" | "Ve";

export interface CertificateData {
  childName: string;
  birthDate: string;
  gender: Gender | "";
  campName: string;
  location: string;
  term: string;
  orderNumber: string;
  amount: string;
  currency: Currency;
  issuePlace: string;
  issuePlacePreposition: Preposition;
  issueDate: string;
}

export const CAMP_OPTIONS = [
  "RobloxCamp",
  "BrawlStarsCamp",
  "TeenageCamp",
  "FortniteCamp",
  "PlayCamp",
  "CraftCamp",
  "StyleCamp",
  "VideoCamp",
  "Halloween",
] as const;

/** One turnus (camp run): its display label and its start/end date (d.m.yyyy, no leading zeros). */
export interface Turnus {
  id: string;
  label: string;
  start: string;
  end: string;
}

export const TURNUSY = {
  t1: { id: "t1", label: "1. turnus", start: "27.6.2026", end: "4.7.2026" },
  t2: { id: "t2", label: "2. turnus", start: "4.7.2026", end: "11.7.2026" },
  t3: { id: "t3", label: "3. turnus", start: "11.7.2026", end: "18.7.2026" },
  t4: { id: "t4", label: "4. turnus", start: "18.7.2026", end: "25.7.2026" },
  t5: { id: "t5", label: "5. turnus", start: "25.7.2026", end: "1.8.2026" },
  t6: { id: "t6", label: "6. turnus", start: "1.8.2026", end: "8.8.2026" },
  t7: { id: "t7", label: "7. turnus", start: "8.8.2026", end: "15.8.2026" },
  t8: { id: "t8", label: "8. turnus", start: "15.8.2026", end: "22.8.2026" },
  d6_1: { id: "d6_1", label: "6denní #1", start: "28.6.2026", end: "3.7.2026" },
  d6_2: { id: "d6_2", label: "6denní #2", start: "5.7.2026", end: "10.7.2026" },
  d6_3: { id: "d6_3", label: "6denní #3", start: "12.7.2026", end: "17.7.2026" },
  d5_1: { id: "d5_1", label: "5denní #1", start: "19.7.2026", end: "23.7.2026" },
  d5_2: { id: "d5_2", label: "5denní #2", start: "26.7.2026", end: "30.7.2026" },
  d5_3: { id: "d5_3", label: "5denní #3", start: "2.8.2026", end: "6.8.2026" },
  d5_4: { id: "d5_4", label: "5denní #4", start: "9.8.2026", end: "13.8.2026" },
  halloween: { id: "halloween", label: "Halloween", start: "28.10.2026", end: "1.11.2026" },
} as const satisfies Record<string, Turnus>;

export type TurnusId = keyof typeof TURNUSY;

/** "27.6. – 4.7.2026": start date drops the year when it matches the end year. */
export function formatTurnusRange(t: Turnus): string {
  const startYear = t.start.split(".").pop();
  const endYear = t.end.split(".").pop();
  const startPart = startYear === endYear ? t.start.slice(0, -startYear!.length) : t.start;
  return `${startPart} – ${t.end}`;
}

interface AreaData {
  camps: readonly string[];
  turnusy: readonly TurnusId[];
}

/** Which camps and turnusy run at each location, per the 2026 capacity sheet. */
export const AREAS: Record<string, AreaData> = {
  "Velešín": {
    camps: [
      "BrawlStarsCamp",
      "CraftCamp",
      "FortniteCamp",
      "PlayCamp",
      "RobloxCamp",
      "StyleCamp",
      "TeenageCamp",
      "Halloween",
    ],
    turnusy: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "d5_1", "d5_2", "d5_3", "d5_4", "halloween"],
  },
  "Polička": {
    camps: ["BrawlStarsCamp", "CraftCamp", "FortniteCamp", "PlayCamp", "RobloxCamp", "StyleCamp"],
    turnusy: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"],
  },
  "Dvůr Králové nad Labem": {
    camps: ["BrawlStarsCamp", "CraftCamp", "FortniteCamp", "PlayCamp", "RobloxCamp", "StyleCamp", "VideoCamp"],
    turnusy: ["t1", "t2", "t3", "t4", "t5", "t6"],
  },
  "Křivoklát": {
    camps: ["BrawlStarsCamp", "CraftCamp", "FortniteCamp", "PlayCamp", "RobloxCamp"],
    turnusy: ["d6_1", "d6_2", "d6_3"],
  },
  "Praha": { camps: [], turnusy: [] },
};

export const LOCATION_OPTIONS = Object.keys(AREAS);

/** Camps offered at a location; falls back to the full list for unknown/custom locations. */
export function getCampsForLocation(location: string): readonly string[] {
  const camps = AREAS[location]?.camps;
  return camps && camps.length > 0 ? camps : CAMP_OPTIONS;
}

/** Turnusy running at a location, resolved to full Turnus objects (with dates). */
export function getTurnusyForLocation(location: string): Turnus[] {
  const ids = AREAS[location]?.turnusy ?? [];
  return ids.map((id) => TURNUSY[id]);
}

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "CZK", label: "Kč" },
  { value: "EUR", label: "€" },
];

/** Locative case (7. pád) of each fixed location, with its correct v/ve preposition. */
const LOCATION_LOCATIVE: Record<string, { form: string; preposition: "v" | "ve" }> = {
  "Velešín": { form: "Velešíně", preposition: "ve" },
  "Polička": { form: "Poličce", preposition: "v" },
  "Dvůr Králové nad Labem": { form: "Dvoře Králové nad Labem", preposition: "ve" },
  "Křivoklát": { form: "Křivoklátě", preposition: "v" },
  "Praha": { form: "Praze", preposition: "v" },
};

/** Lowercase "v"/"ve" + declined place name for mid-sentence use, kept separate so only the
 * place name can be styled bold, e.g. "...se zúčastnila tábora X ve **Velešíně**...". */
export function getLocationParts(location: string): {
  preposition: string;
  form: string;
} {
  const entry = LOCATION_LOCATIVE[location];
  if (entry) return { preposition: entry.preposition, form: entry.form };
  return { preposition: "v", form: location };
}

/** Capitalized "V/Ve <místo>" for the closing line, e.g. "Ve Velešíně dne ...". Falls back to the
 * user-chosen preposition + raw text for custom (non-listed) issue places. */
export function getIssuePlaceClosing(
  issuePlace: string,
  preposition: Preposition,
): string {
  const entry = LOCATION_LOCATIVE[issuePlace];
  if (entry) {
    const capitalized = entry.preposition === "ve" ? "Ve" : "V";
    return `${capitalized} ${entry.form}`;
  }
  return `${preposition} ${issuePlace}`;
}

export function formatAmount(raw: string, currency: Currency): string {
  if (raw.trim() === "") return "";
  const n = Number(raw.replace(/\s/g, ""));
  if (Number.isNaN(n)) return raw;
  const formatted = new Intl.NumberFormat("cs-CZ").format(n);
  const symbol = CURRENCY_OPTIONS.find((c) => c.value === currency)?.label ?? currency;
  return `${formatted} ${symbol}`;
}

export const emptyCertificateData: CertificateData = {
  childName: "",
  birthDate: "",
  gender: "",
  campName: "",
  location: "",
  term: "",
  orderNumber: "",
  amount: "",
  currency: "CZK",
  issuePlace: "",
  issuePlacePreposition: "V",
  issueDate: "",
};

const REQUIRED_FIELDS: (keyof CertificateData)[] = [
  "childName",
  "birthDate",
  "gender",
  "campName",
  "location",
  "term",
  "orderNumber",
  "amount",
  "issuePlace",
  "issueDate",
];

export function isCertificateDataComplete(data: CertificateData): boolean {
  return REQUIRED_FIELDS.every((field) => String(data[field]).trim() !== "");
}
