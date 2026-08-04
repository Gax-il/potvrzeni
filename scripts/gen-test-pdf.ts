import { generateCertificatePdf } from "../src/lib/generate-pdf";
import { writeFileSync } from "fs";

const doc = generateCertificatePdf({
  childName: "Jana Nováková",
  birthDate: "12.4.2013",
  gender: "dívka",
  campName: "CraftCamp",
  location: "Praha",
  term: "7.7. – 14.7.2025",
  orderNumber: "10001",
  amount: "5000",
  currency: "CZK",
  issuePlace: "Velešín",
  issuePlacePreposition: "V",
  issueDate: "2.8.2026",
});

const buf = Buffer.from(doc.output("arraybuffer"));
writeFileSync("/tmp/test-certificate.pdf", buf);
console.log("wrote", buf.length, "bytes");
