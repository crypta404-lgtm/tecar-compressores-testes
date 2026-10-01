/* Run with Playwright installed and TECAR_BASE_URL pointing to the dev server. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const base = process.env.TECAR_BASE_URL || "http://127.0.0.1:4173";
const output = process.env.TECAR_QA_OUTPUT || "/tmp/tecar-qa";
const routes = ["/", "/empresa", "/produtos", "/compressores", "/secadores", "/linhas-de-ar", "/acessorios", "/safety-air", "/servicos", "/manutencao", "/engenharia", "/locacao", "/tecar-connect", "/diagnostico", "/trabalhe-conosco"];
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const errors = [];
  const results = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const route of routes) {
        const response = await page.goto(base + route, { waitUntil: "domcontentloaded" });
        assert.equal(response.status(), 200, route + " HTTP status");
        await page.locator(".tc-editorial").waitFor();
        await page.waitForTimeout(150);
        const layout = await page.evaluate(() => ({
          viewport: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          title: document.title,
          emptyLinks: [...document.querySelectorAll("a")].filter(a => !a.getAttribute("href") || a.getAttribute("href") === "#").length,
        }));
        results.push({ width, route, ...layout });
        assert.ok(layout.documentWidth <= width + 1, route + " overflows at " + width + ": " + layout.documentWidth);
        assert.equal(layout.emptyLinks, 0, route + " placeholder links");
        if (["/", "/produtos", "/diagnostico"].includes(route) && width !== 768) {
          await page.screenshot({ path: output + "/" + (route.slice(1) || "home") + "-" + width + ".png" });
        }
      }
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Produtos", exact: true }).click();
    await page.locator("#tc-products").waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#tc-products").count(), 0);
    await page.getByRole("button", { name: "Serviços", exact: true }).click();
    await page.locator("#tc-services a").first().click();
    await page.waitForURL("**/servicos");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await page.locator("#tc-mobile-nav").waitFor();
    await page.locator("#tc-mobile-nav").getByRole("link", { name: "Compressores", exact: true }).click();
    await page.waitForURL("**/compressores");
    assert.equal(await page.locator("#tc-mobile-nav").count(), 0);
    await page.locator(".v2-product-cards > button").first().click();
    await page.locator(".v2-product-detail").waitFor();
    await page.getByRole("button", { name: "Fechar resumo", exact: true }).click();
    assert.equal(await page.locator(".v2-product-detail").count(), 0);
    const tabs = page.locator(".v2-product-tabs > button");
    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    }

    await page.goto(base, { waitUntil: "networkidle" });
    const form = page.locator(".v2-diagnostic-compact");
    for (let step = 0; step < 8; step++) {
      await form.locator(".v2-diagnostic-options button").first().click();
      await form.getByRole("button", { name: "Continuar", exact: true }).click();
    }
    await form.getByPlaceholder("Ex.: Curitiba / PR").fill("Curitiba / PR");
    await form.getByRole("button", { name: "Continuar", exact: true }).click();
    await form.getByPlaceholder("Nome", { exact: true }).fill("Teste de interface");
    const whatsapp = await form.locator("a.v2-diagnostic-next").getAttribute("href");
    assert.ok(whatsapp.startsWith("https://wa.me/5541996441330?text="));
    assert.ok(decodeURIComponent(whatsapp).includes("Curitiba / PR"));
    assert.ok(decodeURIComponent(whatsapp).includes("Teste de interface"));

    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(base, { waitUntil: "networkidle" });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "320px overflow");
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: output + "/home-1920.png" });
    await page.locator(".cx-range").screenshot({ path: output + "/catalog.png" });
    await page.locator(".tc-services").screenshot({ path: output + "/services.png" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".tc-motion").scrollIntoViewIfNeeded();
    assert.ok(await page.locator(".tc-motion img").first().evaluate(img => img.complete && img.naturalWidth > 0), "motion poster");
    assert.equal(errors.length, 0, "browser errors: " + errors.join("; "));
    fs.writeFileSync(output + "/results.json", JSON.stringify({ results, errors, interactions: "passed" }, null, 2));
    console.log(JSON.stringify({ responsiveChecks: results.length, errors, interactions: "passed", output }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
