import { FrappeApi } from './api';

/**
 * Test-data seeding helpers. Every record gets the [UAT] prefix so
 * global-teardown can sweep them up.
 */

export const UAT_PREFIX = '[UAT]';

export interface SeededEntrepreneur {
  name: string;            // doctype primary key
  entrepreneurName: string;
}

export async function seedEntrepreneur(
  api: FrappeApi,
  overrides: Partial<{
    enterprenur_name: string;
    sector: string;
    district: string;
    block: string;
    village: string;
    phone_number: string;
    cohort: string;
  }> = {}
): Promise<SeededEntrepreneur> {
  const stamp = Date.now().toString(36);
  const ent = await api.insert<{ name: string; enterprenur_name: string }>('Enterprenur Profile', {
    enterprenur_name: overrides.enterprenur_name ?? `${UAT_PREFIX} EP ${stamp}`,
    activity_status: 'Active',
    sector:    overrides.sector,
    district:  overrides.district,
    block:     overrides.block,
    village:   overrides.village,
    // The doctype defaults phone_number to "+91-" which fails Frappe's phone
    // validation, so a seed MUST supply a complete, valid number.
    phone_number: overrides.phone_number ?? '+919876543210',
    cohort:    overrides.cohort,
  });
  return { name: ent.name, entrepreneurName: ent.enterprenur_name };
}

export async function seedSector(api: FrappeApi, label = 'Apiculture'): Promise<string> {
  const stamp = Date.now().toString(36);
  const name = `${UAT_PREFIX} ${label} ${stamp}`;
  await api.insert('Sector', { sector_name: name });
  return name;
}

export async function seedCohort(api: FrappeApi, opts: { start: string; end: string } = {
  start: '2026-04-01', end: '2029-03-31',
}): Promise<string> {
  const name = `${UAT_PREFIX} Cohort ${Date.now().toString(36)}`;
  await api.insert('Cohort', {
    cohort_name: name,
    start_date: opts.start,
    end_date: opts.end,
    status: 'Active',
  });
  return name;
}

export async function deleteIfExists(api: FrappeApi, doctype: string, name: string): Promise<void> {
  try {
    await api.deleteDoc(doctype, name);
  } catch (e) {
    // tolerate — the spec may have already cleaned up
  }
}
