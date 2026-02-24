import { chromium } from "playwright";
import fs from "fs";
import path from "path";

export async function GET() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const url = "http://localhost:4321/cv?pdf=true";

  await page.goto(url, {
    waitUntil: "networkidle",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "15mm",
      bottom: "15mm",
      left: "15mm",
      right: "15mm",
    },
    scale: 1,
  });

  await browser.close();

  // Guardar en /public
  const outputPath = path.resolve("public/cv.pdf");
  fs.writeFileSync(outputPath, pdfBuffer);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=cv.pdf",
    },
  });
}
