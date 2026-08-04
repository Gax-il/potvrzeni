import { jsPDF } from "jspdf";
import {
  NunitoRegularBase64,
  NunitoBoldBase64,
  NunitoExtraBoldBase64,
} from "./nunito-font-data";
import { logo4CampsPngBase64, logo4CampsAspectRatio } from "./logo-data";
import { drawRichText } from "./rich-text";
import {
  formatAmount,
  getLocationParts,
  getIssuePlaceClosing,
  type CertificateData,
} from "@/types";

const BLACK = [0, 0, 0] as [number, number, number];
const GRAY = [90, 90, 90] as [number, number, number];

const MARGIN_X = 24;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

function registerFonts(doc: jsPDF) {
  doc.addFileToVFS("Nunito-Regular.ttf", NunitoRegularBase64);
  doc.addFont("Nunito-Regular.ttf", "Nunito", "normal");
  doc.addFileToVFS("Nunito-Bold.ttf", NunitoBoldBase64);
  doc.addFont("Nunito-Bold.ttf", "Nunito", "bold");
  doc.addFileToVFS("Nunito-ExtraBold.ttf", NunitoExtraBoldBase64);
  doc.addFont("Nunito-ExtraBold.ttf", "NunitoExtraBold", "normal");
}

/** Placeholder for not-yet-filled fields, matching the live preview. Harmless on
 * real downloads: the download button stays disabled until every field is filled. */
const dash = (v: string) => (v.trim() ? v : "…");

export function generateCertificatePdf(data: CertificateData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFonts(doc);

  const verb = data.gender === "chlapec" ? "zúčastnil" : "zúčastnila";
  const locationParts = getLocationParts(data.location);
  const locationForm = data.location ? locationParts.form : "…";
  const closingPhrase = data.issuePlace
    ? getIssuePlaceClosing(data.issuePlace, data.issuePlacePreposition)
    : "…";

  // Header: logo
  const logoHeight = 7.5;
  const logoWidth = logoHeight * logo4CampsAspectRatio;
  doc.addImage(
    `data:image/png;base64,${logo4CampsPngBase64}`,
    "PNG",
    MARGIN_X,
    21,
    logoWidth,
    logoHeight,
  );

  // Rule
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, 35, PAGE_WIDTH - MARGIN_X, 35);

  // Heading
  doc.setFont("NunitoExtraBold", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...BLACK);
  doc.text("Potvrzení o účasti na táboře", MARGIN_X, 46);

  // Paragraph 1
  let y = 58;
  y = drawRichText(
    doc,
    [
      { text: "Potvrzujeme, že " },
      { text: dash(data.childName), bold: true },
      { text: ", nar. " },
      { text: dash(data.birthDate), bold: true },
      { text: `, se ${verb} tábora ` },
      { text: dash(data.campName), bold: true },
      { text: ` ${locationParts.preposition} ` },
      { text: locationForm, bold: true },
      { text: " v termínu " },
      { text: dash(data.term), bold: true },
      { text: ", č. objednávky: " },
      { text: dash(data.orderNumber), bold: true },
      { text: "." },
    ],
    MARGIN_X,
    y,
    CONTENT_WIDTH,
    { fontFamily: "Nunito", fontSize: 9.5, lineHeight: 5, color: BLACK },
  );

  y += 3;

  // Paragraph 2
  y = drawRichText(
    doc,
    [
      { text: "Byla uhrazena celková částka " },
      { text: formatAmount(data.amount, data.currency) || "…", bold: true },
      { text: "." },
    ],
    MARGIN_X,
    y,
    CONTENT_WIDTH,
    { fontFamily: "Nunito", fontSize: 9.5, lineHeight: 5, color: BLACK },
  );

  // Closing line + signature area (sits just above the footer, not mid-page)
  const closeY = 252;
  doc.setFont("Nunito", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...BLACK);
  doc.text(`${closingPhrase} dne ${dash(data.issueDate)}:`, MARGIN_X, closeY);

  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.3);
  doc.line(
    PAGE_WIDTH - MARGIN_X - 55,
    closeY + 14,
    PAGE_WIDTH - MARGIN_X,
    closeY + 14,
  );
  doc.setFont("Nunito", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text("razítko a podpis", PAGE_WIDTH - MARGIN_X - 27.5, closeY + 18, {
    align: "center",
  });

  // Footer
  doc.setFont("Nunito", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text("Organizátorem akcí 4CAMPS je Zvědavý medvěd z. s.", MARGIN_X, 275);
  doc.text(
    "Konzumní 444/27, Hloubětín, 198 00 Praha | IČ: 06832890 | 4camps.cz",
    MARGIN_X,
    279.5,
  );

  return doc;
}

export function downloadCertificatePdf(data: CertificateData) {
  const doc = generateCertificatePdf(data);
  const safeName = data.childName.trim().replace(/\s+/g, "_") || "potvrzeni";
  doc.save(`Potvrzeni_ucasti_${safeName}.pdf`);
}
