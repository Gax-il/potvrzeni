import logoUrl from "@/assets/logo-4camps.svg";
import {
  formatAmount,
  getLocationParts,
  getIssuePlaceClosing,
  type CertificateData,
} from "@/types";

const INK = "#000000";
const GRAY = "#5A5A5A";

export function CertificatePreview({ data }: { data: CertificateData }) {
  const verb = data.gender === "chlapec" ? "zúčastnil" : "zúčastnila";
  const locationParts = getLocationParts(data.location);
  const closingPhrase = data.issuePlace
    ? getIssuePlaceClosing(data.issuePlace, data.issuePlacePreposition)
    : "";

  return (
    <div className="@container w-full">
      <div
        className="relative aspect-210/297 w-full overflow-hidden rounded-sm shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
        style={{ background: "#FEFDFA", color: INK, fontFamily: "Nunito, sans-serif" }}
      >
        <div className="absolute inset-0 flex flex-col px-[11.4cqw] pt-[9cqw] pb-[8cqw]">
          <img src={logoUrl} alt="4Camps" className="h-[3.6cqw] w-auto" />

          <div className="mt-[3.5cqw] w-full border-t" style={{ borderColor: INK }} />

          <h1 className="mt-[4cqw] text-[3.4cqw] font-extrabold leading-[1.25] [text-wrap:balance]">
            Potvrzení o účasti na táboře
          </h1>

          <div className="mt-[5cqw] space-y-[2.6cqw] text-[2.3cqw] leading-[1.6]">
            <p>
              Potvrzujeme, že <strong>{data.childName || "…"}</strong>, nar.{" "}
              <strong>{data.birthDate || "…"}</strong>, se {verb} tábora{" "}
              <strong>{data.campName || "…"}</strong> {locationParts.preposition}{" "}
              <strong>{data.location ? locationParts.form : "…"}</strong> v termínu{" "}
              <strong>{data.term || "…"}</strong>, č. objednávky:{" "}
              <strong>{data.orderNumber || "…"}</strong>.
            </p>
            <p>
              Byla uhrazena celková částka{" "}
              <strong>{formatAmount(data.amount, data.currency) || "…"}</strong>.
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between pt-[6cqw]">
            <p className="text-[2.3cqw]">
              {closingPhrase || "…"} dne {data.issueDate || "…"}:
            </p>
            <div className="flex flex-col items-center gap-[1cqw]">
              <div
                className="w-[15cqw] border-t"
                style={{ borderColor: `${GRAY}66` }}
              />
              <div className="text-[1.5cqw]" style={{ color: GRAY }}>
                razítko a podpis
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-[3cqw] left-[11.4cqw] right-[11.4cqw] text-[1.4cqw] leading-[1.6]"
            style={{ color: GRAY }}
          >
            <p>Organizátorem akcí 4CAMPS je Zvědavý medvěd z. s.</p>
            <p>
              Konzumní 444/27, Hloubětín, 198 00 Praha | IČ: 06832890 |
              4camps.cz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
