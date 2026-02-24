import { chromium } from "playwright";
import fs from "fs";
import path from "path";

(async () => {
  try {
    console.log("🟡 Generando PDF del CV...");

    const browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage({
      viewport: { width: 1280, height: 1800 }
    });

    const url = "http://localhost:4321/cv";

    console.log("🌐 Abriendo:", url);

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000
    });

    // Esperar a que cargue el CV real
    await page.waitForSelector(".cv-page", { timeout: 30000 });

    const pdf = await page.pdf({
      path: path.resolve("public/cv.pdf"),
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm",
      }
    });

    await browser.close();

    console.log("✅ PDF generado correctamente en: public/cv.pdf");

  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    process.exit(1);
  }
})();
