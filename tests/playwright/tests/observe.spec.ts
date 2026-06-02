/**
 * Seed-and-observe harness — the "log in as a role, browse, record observations"
 * engine. Reads the fixture manifest written by ../../_seed_fixtures.py, opens
 * each seeded framework record as the SM role, and records rendered-state
 * observations to ../../_observations.json. No data-testid needed — it reads
 * what the portal renders. Data is API-seeded (no brittle form-filling) and torn
 * down by ../../_cleanup_fixtures.py.
 *
 * Flow:
 *   python _seed_fixtures.py            # writes _fixtures.json (keeps records)
 *   npx playwright test observe --project=sm   # writes _observations.json
 *   python _cleanup_fixtures.py         # deletes the seeded records + EP
 *
 * Note: API-seeded records do not carry client-computed values, and the Vue form
 * does not recompute read-only calc fields on load — so `computed_zero_on_load`
 * reflects that (confirm bug-vs-artifact with a UI-created record). The nudge
 * (re-enter the first numeric input) checks the client calc engine still fires.
 */
import { test } from '@playwright/test';
import * as fs from 'fs';

test.use({ storageState: '.auth/uat-sm.json' });
test.setTimeout(20 * 60 * 1000);

test('seed-and-observe: open each framework record as SM, read rendered state', async ({ page }) => {
  const man = JSON.parse(fs.readFileSync('../../_fixtures.json', 'utf8'));
  const obs: any[] = [];
  for (const rec of man.records.filter((r: any) => r.status === 'SEEDED')) {
    const o: any = { framework: rec.framework, record: rec.record };
    const errs: string[] = [];
    const onErr = (m: any) => { if (m.type() === 'error') errs.push(m.text().slice(0, 80)); };
    page.on('console', onErr);
    try {
      await page.goto('/primerural/d/' + encodeURIComponent(rec.doctype) + '/' + encodeURIComponent(rec.record));
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1800);
      const main = await page.locator('main').innerText().catch(() => '');
      o.loaded = !!(await page.locator('main h1, main h2').first().innerText().catch(() => '')) && !/loading…/i.test(main);
      const tabs = (await page.locator('main button').allInnerTexts().catch(() => []))
        .filter(t => /^(details|existing|required|summary|log book|resources|sales tracker|canvas|prototyp|line items|variant)/i.test(t.trim()));
      o.tabs = [...new Set(tabs.map(t => t.trim()))];
      await page.locator('main button').filter({ hasText: /^existing$/i }).first().click().catch(() => {});
      await page.waitForTimeout(1200);
      const before = await page.locator('main').innerText().catch(() => '');
      o.computed_zero_on_load = (before.match(/[A-Z][A-Z \/]{4,}\s*₹?\s*0(\.0+)?\b/g) || []).slice(0, 4);
      o.n_selects = await page.locator('main select').count().catch(() => 0);
      const num = page.locator('main input[type="number"]').first();
      if (await num.count()) {
        const v = await num.inputValue().catch(() => '');
        await num.fill(v && v !== '0' ? v : '10').catch(() => {});
        await num.blur().catch(() => {});
        await page.waitForTimeout(900);
        const after = await page.locator('main').innerText().catch(() => '');
        o.nudge_made_nonzero_calc = /₹\s?[1-9][\d,]*/.test(after) && !/₹\s?[1-9]/.test(before.replace(/₹\s?0/g, ''));
      }
      o.console_errors = errs.length;
    } catch (e: any) { o.error = String(e).slice(0, 100); }
    page.off('console', onErr);
    obs.push(o);
  }
  fs.writeFileSync('../../_observations.json', JSON.stringify(obs, null, 1));
});
