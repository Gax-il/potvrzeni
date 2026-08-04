import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CURRENCY_OPTIONS,
  formatTurnusRange,
  getCampsForLocation,
  getTurnusyForLocation,
  LOCATION_OPTIONS,
  type CertificateData,
  type Gender,
  type Preposition,
} from "@/types";

const CUSTOM_SENTINEL = "__custom__";

interface FieldProps {
  label: string;
  id: keyof CertificateData;
  value: string;
  onChange: (id: keyof CertificateData, value: string) => void;
  placeholder?: string;
  type?: string;
  span?: 1 | 2;
  hint?: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  span = 2,
  hint,
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${span === 1 ? "col-span-1" : "col-span-2"}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(id, e.target.value)}
        className="tabular-nums"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  id: keyof CertificateData;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (id: keyof CertificateData, value: string) => void;
  span?: 1 | 2;
}

/** Select from `options`, with a "Jiné…" fallback that switches to a free-text input
 * so values outside the predefined area data can still be entered. */
function SelectField({
  label,
  id,
  value,
  options,
  placeholder,
  onChange,
  span = 2,
}: SelectFieldProps) {
  const [customMode, setCustomMode] = useState(
    value !== "" && !options.includes(value),
  );

  return (
    <div className={`flex flex-col gap-1.5 ${span === 1 ? "col-span-1" : "col-span-2"}`}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={customMode ? CUSTOM_SENTINEL : value || undefined}
        onValueChange={(v) => {
          if (v === CUSTOM_SENTINEL) {
            setCustomMode(true);
            onChange(id, "");
          } else {
            setCustomMode(false);
            onChange(id, v);
          }
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_SENTINEL}>Jiné…</SelectItem>
        </SelectContent>
      </Select>
      {customMode && (
        <Input
          autoFocus
          value={value}
          placeholder="Vlastní hodnota"
          onChange={(e) => onChange(id, e.target.value)}
        />
      )}
    </div>
  );
}

function AmountField({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
}: {
  amount: string;
  currency: CertificateData["currency"];
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: CertificateData["currency"]) => void;
}) {
  return (
    <div className="col-span-1 flex flex-col gap-1.5">
      <Label htmlFor="amount">Celková částka</Label>
      <div className="flex gap-2">
        <Input
          id="amount"
          type="number"
          value={amount}
          placeholder="5000"
          onChange={(e) => onAmountChange(e.target.value)}
          className="tabular-nums"
        />
        <Select value={currency} onValueChange={(v) => onCurrencyChange(v as CertificateData["currency"])}>
          <SelectTrigger className="w-20 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function IssuePlaceField({
  value,
  preposition,
  onChange,
  onPrepositionChange,
}: {
  value: string;
  preposition: Preposition;
  onChange: (id: keyof CertificateData, value: string) => void;
  onPrepositionChange: (value: Preposition) => void;
}) {
  const [customMode, setCustomMode] = useState(
    value !== "" && !(LOCATION_OPTIONS as readonly string[]).includes(value),
  );

  return (
    <div className="col-span-1 flex flex-col gap-1.5">
      <Label htmlFor="issuePlace">Místo podpisu</Label>
      <Select
        value={customMode ? CUSTOM_SENTINEL : value || undefined}
        onValueChange={(v) => {
          if (v === CUSTOM_SENTINEL) {
            setCustomMode(true);
            onChange("issuePlace", "");
          } else {
            setCustomMode(false);
            onChange("issuePlace", v);
          }
        }}
      >
        <SelectTrigger id="issuePlace" className="w-full">
          <SelectValue placeholder="Vyber místo" />
        </SelectTrigger>
        <SelectContent>
          {LOCATION_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_SENTINEL}>Jiné…</SelectItem>
        </SelectContent>
      </Select>
      {customMode && (
        <div className="flex gap-2">
          <Select value={preposition} onValueChange={(v) => onPrepositionChange(v as Preposition)}>
            <SelectTrigger className="w-16 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="V">V</SelectItem>
              <SelectItem value="Ve">Ve</SelectItem>
            </SelectContent>
          </Select>
          <Input
            autoFocus
            value={value}
            placeholder="Vlastní místo"
            onChange={(e) => onChange("issuePlace", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

/** Term select driven by the chosen location's turnusy. Picking a turnus fills the term
 * text with its date range and defaults the signing date to the turnus's last day; "Jiné…"
 * falls back to a free-text term with no effect on the signing date. */
function TermField({
  location,
  value,
  onChange,
  onIssueDateChange,
}: {
  location: string;
  value: string;
  onChange: (id: keyof CertificateData, value: string) => void;
  onIssueDateChange: (value: string) => void;
}) {
  const options = getTurnusyForLocation(location);
  const matched = options.find((t) => formatTurnusRange(t) === value);
  const [customMode, setCustomMode] = useState(
    !matched && (value !== "" || options.length === 0),
  );

  return (
    <div className="col-span-2 flex flex-col gap-1.5">
      <Label htmlFor="term">Termín</Label>
      <Select
        value={customMode ? CUSTOM_SENTINEL : matched?.id}
        onValueChange={(v) => {
          if (v === CUSTOM_SENTINEL) {
            setCustomMode(true);
            onChange("term", "");
          } else {
            const turnus = options.find((o) => o.id === v);
            if (!turnus) return;
            setCustomMode(false);
            onChange("term", formatTurnusRange(turnus));
            onIssueDateChange(turnus.end);
          }
        }}
      >
        <SelectTrigger id="term" className="w-full">
          <SelectValue
            placeholder={options.length ? "Vyber termín" : "Nejprve vyber místo konání"}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((turnus) => (
            <SelectItem key={turnus.id} value={turnus.id}>
              {turnus.label} ({formatTurnusRange(turnus)})
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_SENTINEL}>Jiné…</SelectItem>
        </SelectContent>
      </Select>
      {customMode && (
        <Input
          autoFocus
          value={value}
          placeholder="18.7. – 25.7.2025"
          onChange={(e) => onChange("term", e.target.value)}
        />
      )}
    </div>
  );
}

interface CertificateFormProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
}

export function CertificateForm({ data, onChange }: CertificateFormProps) {
  const set = (id: keyof CertificateData, value: string) =>
    onChange({ ...data, [id]: value } as CertificateData);

  const handleLocationChange = (_id: keyof CertificateData, value: string) => {
    const campStillValid = getCampsForLocation(value).includes(data.campName);
    onChange({
      ...data,
      location: value,
      campName: campStillValid ? data.campName : "",
      term: "",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      <Field
        label="Jméno a příjmení dítěte"
        id="childName"
        value={data.childName}
        onChange={set}
        placeholder="Jméno Příjmení"
      />

      <Field
        label="Datum narození"
        id="birthDate"
        value={data.birthDate}
        onChange={set}
        placeholder="1.1.2015"
        span={1}
      />

      <div className="col-span-1 flex flex-col gap-1.5">
        <Label htmlFor="gender">Pohlaví</Label>
        <div className="flex h-9 items-center gap-4 px-1">
          {(["dívka", "chlapec"] as Gender[]).map((g) => (
            <label
              key={g}
              className="flex items-center gap-1.5 text-sm cursor-pointer select-none"
            >
              <input
                type="radio"
                name="gender"
                checked={data.gender === g}
                onChange={() => set("gender", g)}
                className="accent-primary"
              />
              {g === "dívka" ? "Dívka" : "Chlapec"}
            </label>
          ))}
        </div>
      </div>

      <SelectField
        label="Místo konání"
        id="location"
        value={data.location}
        options={LOCATION_OPTIONS}
        placeholder="Vyber místo"
        onChange={handleLocationChange}
      />

      <SelectField
        label="Camp"
        id="campName"
        value={data.campName}
        options={getCampsForLocation(data.location)}
        placeholder="Vyber camp"
        onChange={set}
      />

      <TermField
        location={data.location}
        value={data.term}
        onChange={set}
        onIssueDateChange={(v) => set("issueDate", v)}
      />

      <Field
        label="Číslo objednávky"
        id="orderNumber"
        value={data.orderNumber}
        onChange={set}
        placeholder="12345"
        span={1}
        hint="Variabilní symbol v Core bez 422"
      />

      <AmountField
        amount={data.amount}
        currency={data.currency}
        onAmountChange={(v) => set("amount", v)}
        onCurrencyChange={(v) => onChange({ ...data, currency: v })}
      />

      <IssuePlaceField
        value={data.issuePlace}
        preposition={data.issuePlacePreposition}
        onChange={set}
        onPrepositionChange={(v) => onChange({ ...data, issuePlacePreposition: v })}
      />

      <Field
        label="Datum vystavení"
        id="issueDate"
        value={data.issueDate}
        onChange={set}
        placeholder="1.8.2026"
        span={1}
      />
    </div>
  );
}
