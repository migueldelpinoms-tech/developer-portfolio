import { chromium } from "playwright";
import path from "path";

const URL = "http://localhost:4321/pdf/cv-empresa-pdf";
const OUTPUT_PATH = path.resolve("public/cv-empresa.pdf");

(async () => {
  console.log("📄 Generando CV Empresa (PDF real profesional)...");

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1240,
      height: 1754, // proporción A4
    },
  });

  // 1️⃣ FORZAR MEDIA PRINT ANTES DE CARGAR LA PÁGINA (CLAVE)
  await page.emulateMedia({ media: "print" });

  // 2️⃣ Cargar página y esperar render completo
  await page.goto(URL, {
    waitUntil: "networkidle",
  });

  // 3️⃣ Esperar a que las fuentes estén realmente cargadas
  await page.evaluateHandle("document.fonts.ready");

  // 4️⃣ Pequeña pausa de seguridad (layout estable)
  await page.waitForTimeout(300);

  // 5️⃣ Generar PDF
  await page.pdf({
    path: OUTPUT_PATH,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "18mm",
      right: "18mm",
      bottom: "18mm",
      left: "18mm",
    },
  });

  await browser.close();

  console.log("✅ CV EMPRESA generado correctamente:");
  console.log("➡ public/cv-empresa.pdf");
})();
