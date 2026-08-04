import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { generateCertificatePdf } from "@/lib/generate-pdf";
import type { CertificateData } from "@/types";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Raster width the PDF page is rendered at, before CSS scales it to the
// container. High enough to stay crisp on retina displays.
const RENDER_WIDTH_PX = 1000;

/**
 * Rasterizes the actual generated PDF onto a plain <canvas>, so the preview
 * can never drift from the downloaded file and carries none of the browser's
 * native PDF-viewer chrome (toolbar, zoom controls, scrollbars).
 */
export function CertificatePreview({ data }: { data: CertificateData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        const bytes = generateCertificatePdf(data).output(
          "arraybuffer",
        ) as ArrayBuffer;
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = RENDER_WIDTH_PX / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      })();
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [data]);

  return (
    <div className="w-full">
      <div className="relative aspect-210/297 w-full overflow-hidden rounded-sm bg-white shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
