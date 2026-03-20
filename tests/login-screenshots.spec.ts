import { test, expect } from "@playwright/test";

/**
 * These tests generate deterministic screenshots for the Login page states.
 *
 * Output location:
 * - tests/screenshots/login-loading-light.png
 * - tests/screenshots/login-loading-dark.png
 * - tests/screenshots/login-error-required-light.png
 * - tests/screenshots/login-error-required-dark.png
 */

async function setTheme(page: import("@playwright/test").Page, theme: "light" | "dark") {
  // Your app reads theme from localStorage in app/layout.tsx before first paint.
  await page.addInitScript((t) => {
    localStorage.setItem("theme", t);
  }, theme);
}

async function gotoLoginAndStabilize(page: import("@playwright/test").Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  // Wait until Next.js hydration and layout settle.
  await page.locator("#email").waitFor({ state: "visible" });

  // Ensure the theme class has been applied from the inline script.
  await expect(page.locator("html")).toHaveClass(/dark|^((?!dark).)*$/);

  // Wait for fonts from next/font (Anuphan) to be ready.
  await page.waitForFunction(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    return fonts ? fonts.status === "loaded" : true;
  });

  // Small buffer to avoid final micro layout shifts.
  await page.waitForTimeout(200);
}

test.describe("Login screenshots", () => {
  test.use({ viewport: { width: 1366, height: 768 } });

  for (const theme of ["light", "dark"] as const) {
    test(`${theme} - default state`, async ({ page }) => {
      await setTheme(page, theme);
      await gotoLoginAndStabilize(page);

      const submit = page.locator("button[type='submit']");
      await expect(submit).toBeEnabled();
      await expect(page.locator("#login-error")).toHaveCount(0);

      const card = page.locator("#email").locator("xpath=ancestor::div[contains(@class,'max-w-sm')]"
      );
      await expect(card).toBeVisible();

      await page.waitForTimeout(150);
      await card.screenshot({ path: `tests/screenshots/login-default-${theme}.png` });
    });

    test(`${theme} - loading state`, async ({ page }) => {
      await setTheme(page, theme);
      await gotoLoginAndStabilize(page);

      await page.locator("#email").fill("demo@example.com");
      await page.locator("#password").fill("not-a-real-password");

      await page.evaluate(() => {
        const submit = document.querySelector<HTMLButtonElement>("button[type='submit']");
        if (!submit) return;
        submit.disabled = true;

        if (!submit.querySelector("svg.animate-spin")) {
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("aria-hidden", "true");
          svg.classList.add("animate-spin");
          svg.style.width = "16px";
          svg.style.height = "16px";
          svg.style.marginRight = "8px";

          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", "12");
          circle.setAttribute("cy", "12");
          circle.setAttribute("r", "9");
          circle.setAttribute("fill", "none");
          circle.setAttribute("stroke", "currentColor");
          circle.setAttribute("stroke-width", "2");
          circle.setAttribute("stroke-linecap", "round");
          circle.setAttribute("stroke-dasharray", "42");
          circle.setAttribute("stroke-dashoffset", "12");
          svg.appendChild(circle);

          submit.prepend(svg);
        }
      });

      const submit = page.locator("button[type='submit']");
      await expect(submit).toBeDisabled();
      await expect(submit.locator("svg.animate-spin")).toBeVisible();

      const card = page.locator("#email").locator("xpath=ancestor::div[contains(@class,'max-w-sm')]"
      );
      await expect(card).toBeVisible();

      await page.waitForTimeout(150);
      await card.screenshot({ path: `tests/screenshots/login-loading-${theme}.png` });
    });

    test(`${theme} - error state - required fields`, async ({ page }) => {
      await setTheme(page, theme);
      await gotoLoginAndStabilize(page);

      await page.locator("button[type='submit']").click();

      await expect(page.locator("#login-error")).toBeVisible();

      const card = page.locator("#email").locator("xpath=ancestor::div[contains(@class,'max-w-sm')]"
      );
      await expect(card).toBeVisible();

      await page.waitForTimeout(150);
      await card.screenshot({ path: `tests/screenshots/login-error-required-${theme}.png` });
    });
  }
});
