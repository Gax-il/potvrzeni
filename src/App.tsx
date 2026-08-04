import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";
import { CertificateForm } from "@/components/CertificateForm";
import { CertificatePreview } from "@/components/CertificatePreview";
import { downloadCertificatePdf } from "@/lib/generate-pdf";
import {
  emptyCertificateData,
  isCertificateDataComplete,
  type CertificateData,
} from "@/types";

function App() {
  const [data, setData] = useState<CertificateData>(emptyCertificateData);
  const complete = isCertificateDataComplete(data);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <LogoMark height={20} />
          <p className="hidden text-xs text-muted-foreground sm:block">
            Generátor potvrzení o účasti na táboře
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Údaje o účastníkovi
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Vyplň údaje vlevo, náhled potvrzení se aktualizuje napravo.
            </p>
          </div>

          <CertificateForm data={data} onChange={setData} />

          <div className="flex flex-col gap-2 sm:items-start">
            <Button
              className="w-full sm:w-auto"
              disabled={!complete}
              onClick={() => downloadCertificatePdf(data)}
            >
              Stáhnout PDF potvrzení
            </Button>
            {!complete && (
              <p className="text-xs text-muted-foreground">
                Vyplňte prosím všechny údaje před stažením PDF.
              </p>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-10">
          <CertificatePreview data={data} />
        </div>
      </main>
    </div>
  );
}

export default App;
