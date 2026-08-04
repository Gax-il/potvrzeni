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
] as const;

export const LOCATION_OPTIONS = [
  "Velešín",
  "Polička",
  "Dvůr Králové nad Labem",
  "Křivoklát",
  "Praha",
] as const;

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
