import type { jsPDF } from "jspdf";

export interface TextRun {
  text: string;
  bold?: boolean;
}

interface DrawRichTextOptions {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  color?: [number, number, number];
}

/**
 * Word-wraps a sequence of bold/regular runs across maxWidth, measuring each
 * word with the correct weight before placing it. jsPDF has no native inline
 * bold support within a single text() call, so runs are laid out word by word.
 */
export function drawRichText(
  doc: jsPDF,
  runs: TextRun[],
  x: number,
  y: number,
  maxWidth: number,
  { fontFamily, fontSize, lineHeight, color }: DrawRichTextOptions,
): number {
  doc.setFontSize(fontSize);
  if (color) doc.setTextColor(...color);

  let cursorX = x;
  let cursorY = y;

  for (const run of runs) {
    const words = run.text.split(/(\s+)/).filter((w) => w.length > 0);
    for (const word of words) {
      doc.setFont(fontFamily, run.bold ? "bold" : "normal");
      const wordWidth = doc.getTextWidth(word);
      const isSpace = /^\s+$/.test(word);

      if (!isSpace && cursorX - x + wordWidth > maxWidth) {
        cursorX = x;
        cursorY += lineHeight;
      }

      if (isSpace && cursorX === x) {
        continue;
      }

      doc.text(word, cursorX, cursorY);
      cursorX += wordWidth;
    }
  }

  return cursorY + lineHeight;
}
