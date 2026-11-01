# BATCH 1 — Prescriptions Add/Update Report

**Branch:** `feature/prescriptions-batch1`
**Status:** implemented, built, verified — **not committed, not pushed, not deployed**.
**Data:** `src/data/prescriptions.json` — 72 → **89** cases (17 CREATE, 9 UPDATE, 27 source cases).

---

## 1. Source constraints actually available

| Requirement | Reality in this workspace | Action taken |
|---|---|---|
| Drug / price guide | **No guide file exists.** The only price data is what is already inside `src/data/prescriptions.json` (202 RX prices + 203 per-drug entries). The `dwa-drug-db` folder at `C:\Users\hp\Documents\dwa-drug-db` is unusable (20,995 / 23,543 rows are named `aaa`; zero hits for common brands). | Every price was copied **verbatim** from an existing case and asserted by script against the 72-case file before writing. Anything not found keeps the written name + `⚠ غير مطابق` and **no price**. |
| Drug-interaction file | **Does not exist.** | No interaction rows were added. All 11 suggested interactions are listed in §8 for review. |
| ABCDrugs / `max_dose` | **Not available**, and `max_dose` is not a field in the schema. | No `max_dose` values were invented. Dose “hints” from the source file are recorded in §9. |
| Dedupe | Done by name, synonym and active ingredient. | 9 UPDATE targets, 17 CREATE, one merge (cases 5 + 6 → `069`). See §2. |
| `H. pylori Eradication` | Must not be modified. | Content untouched; only the required mutual `related` link was added (`022 → 073`), because the source file explicitly requires a mutual link. |
| Estesharah | Out of scope for this batch. | No changes. |

---

## 2. The 27 source cases → database outcome

| # | Source case | Outcome | Target id |
|---|---|---|---|
| 1 | Common Cold | UPDATE | `rochetta-056` |
| 2 | Acute Bronchitis | UPDATE | `rochetta-057` |
| 3 | Chronic Gastritis | **CREATE** (+ mutual link to 022) | `rochetta-073` |
| 4 | GERD | UPDATE | `rochetta-065` |
| 5 | Recurrent Aphthous Ulcer | UPDATE (merged box) | `rochetta-069` |
| 6 | Oral Candidiasis | UPDATE (merged box) | `rochetta-069` |
| 7 | Irritable Bowel Syndrome | UPDATE | `rochetta-068` |
| 8 | Typhoid (Enteric) Fever | **CREATE** | `rochetta-074` |
| 9 | Gout (Acute & Chronic) | UPDATE | `rochetta-012` |
| 10 | Urinary Tract Infection | UPDATE | `rochetta-048` |
| 11 | Urinary Crystals, Gravel & Stones | **CREATE** (+ link → 050) | `rochetta-075` |
| 12 | Migraine | UPDATE | `rochetta-014` |
| 13 | Trigeminal Neuralgia | **CREATE** | `rochetta-076` |
| 14 | Sciatica | **CREATE** | `rochetta-077` |
| 15 | Diabetic Neuropathy | **CREATE** (+ link → 010) | `rochetta-078` |
| 16 | Cluster Headache | **CREATE** | `rochetta-079` |
| 17 | Memory Improvement | **CREATE** | `rochetta-080` |
| 18 | Insomnia | UPDATE | `rochetta-005` |
| 19 | Obesity & Weight Reduction | **CREATE** | `rochetta-081` |
| 20 | Amoebiasis | **CREATE** | `rochetta-082` |
| 21 | Giardiasis | **CREATE** | `rochetta-083` |
| 22 | Enterobiasis | **CREATE** | `rochetta-084` |
| 23 | Ancylostomiasis | **CREATE** | `rochetta-085` |
| 24 | Ascariasis | **CREATE** | `rochetta-086` |
| 25 | Hymenolepis nana | **CREATE** | `rochetta-087` |
| 26 | Bilharziasis | **CREATE** | `rochetta-088` |
| 27 | Taeniasis | **CREATE** | `rochetta-089` |

**Counts:** 27 source cases → 26 rows changed (5 + 6 share `069`); 9 UPDATE rows + 17 CREATE rows.

### Category counts (auto-derived, validator updated)

| Chapter | Before | After |
|---|---|---|
| Psychiatry | 8 | **9** |
| Pain & Analgesics | 8 | **12** |
| Antibiotics | 7 | **8** |
| Dermatology | 15 | 15 |
| Cardiovascular | 8 | 8 |
| Urinary | 8 | **9** |
| Respiratory | 8 | 8 |
| GIT | 9 | **18** |
| Others | 1 | **2** |
| **Total** | **72** | **89** |

---

## 3. UPDATE cases — what changed

All existing sections that the source file did not address were kept. New source boxes were **appended** with a labelled heading so nothing existing was overwritten, except in the two cases where the source explicitly rewrites the regimen (`012`, `048`).

### `rochetta-056` Common Cold / URTI
- **Added box:** `RX-الروشتة — نزلة البرد (نسخة المصدر)` — Brufen Cold, Otrivin adult drops, Bronchicum syrup, Hibiotic (all 4 unmatched, no prices).
- **Warning +1:** “Antibiotic only if bacterial infection is suspected; limit topical nasal decongestant to 5 days.”
- **Instruction +1:** warm fluids / anise.
- **perDrug +2:** Otrivin (unmatched, alternative Afrin 5 ج.م), Hibiotic (unmatched, alternative Augmentin 210 ج.م).
- Existing `RX` box, Panadol/Afrin/Cetirizine rows untouched.

### `rochetta-057` Acute Bronchitis
- **Added box:** `RX-الروشتة — الشعب الهوائية (نسخة المصدر)` — Brufen 400 (78), Otrivin (U), Bronchicum (U), Vental (U), Zithromax 250 (120).
- **Instruction +1:** warm fluids (lemon/anise/fenugreek).
- **perDrug +2:** Zithromax 250 → Azithromycin 250 (49.5); Brufen 400 → Ibuprofen 400 (6).
- Existing two RX boxes untouched.

### `rochetta-065` GERD & Peptic Ulcer
- **Added boxes:** `RX-الروشتة — في الاستقبال (ER)` (IV saline + Antodine/Primperan/Visceralgine = U; Controloc 40 vial = U) and `RX-الروشتة — في البيت` (Omez 20 = 20, Epicogel = U, Motilium = 100).
- **Treatment +2:** IV cannula + ECG to exclude MI; Controloc 40 vial if no improvement.
- **Instructions +5** (food triggers, no food 3 h before bed, weight/head elevation, no NSAIDs).
- **perDrug +3:** Controloc 40 vial (U) → Controloc 20 (90); Omez 20 → Controloc 40 tab (U); Motilium → Domperidone GPO (15).
- **Restored:** the first-word dedupe briefly dropped the pre-existing `Controloc 20mg tab` and `Antodine 20mg tab` rows; both are back verbatim.

### `rochetta-068` Spastic Colon / IBS
- **Added boxes:** `…القولون العصبي (نسخة المصدر)` (Colona, Spasmodigestin, Gast-reg, Disflatyl — all U) and `…خيار آخر` (Coloverin A = 99, Coloverin SR = U).
- **Instructions +5** (fibre, no heavy meals, avoid legumes/cabbage/coffee, stress).
- **perDrug +2:** Coloverin A (99) → Coloverin SR (U); Gast-reg (U) → Motilium (100).
- **Restored:** pre-existing `Coloverin A tab | 25 ج.م` row kept (see price conflict §7).

### `rochetta-012` Gout
- **Title:** `Acute Gout` → `Gout (Acute & Chronic)`.
- **Replaced boxes** (source rewrites the regimen): removed `RX…Acute Attack` and `RX…Prophylaxis`; added three boxes:
  - ER acute flare: Colchicine (190), Diclofenac 75 IM (17);
  - Home acute flare: Colchicine (190), Indocid (U), Prednisone 30–40 mg/day PO × 5 days (U);
  - Chronic ULT: Zyloric (U), Colchicine prophylaxis (190), Probenecid (U).
- **Treatment:** removed “Start Allopurinol 2–4 weeks AFTER attack settles” and replaced with “ULT may be started during a flare under anti-inflammatory cover…”; added ULT indication and febuxostat note.
- **Warning +3** (colchicine, NSAIDs, probenecid cautions).
- **Instructions:** removed the old “allopurinol after attack” line; added 5 (fluids, diet, weight, long-term monitoring, ULT during flare).
- **perDrug:** removed `Diclofenac 50` and `Allopurinol 100` rows linked to the deleted boxes; added Diclofenac 75 IM → Voltaren 80 and Zyloric (U) → Allopurinol 8 / Zyloprim 60.
- **Source correction:** the file used for this run writes **Prednisone 30–40 mg/day PO × 5 days** (already a per-day dose). No `20–40 mg/kg` text exists in it, so nothing was rewritten; see §6.

### `rochetta-014` Migraine
- **Added boxes:** `…أثناء النوبة (نسخة المصدر)` (Cataflam 75 IM = 100, Primperan amp = U, Sumagraine = U) and `…الوقاية (نسخة المصدر)` (Pizotifen = U, Inderal 10 = U).
- **Warning +1:** sumatriptan contraindicated in IHD / uncontrolled hypertension.
- **perDrug +2:** Cataflam 75 IM → Diclofenac 75 IM (17); Sumagraine (U) → Sumatriptan 50 (90).
- Existing Acute / Prophylaxis boxes kept.

### `rochetta-005` Insomnia
- **Added box:** `RX-الروشتة — Sleep Aid` (Sleep Aid 5 mg = U; active ingredient deliberately not assumed).
- **Instruction +2:** dosing window and caffeine cutoff.
- Existing Zolpidem/Melatonin/Amitriptyline content untouched.

### `rochetta-048` Lower UTI / Cystitis
- **Replaced boxes:** removed the old `Uncomplicated` and `Complicated / Systemic` boxes; **kept the `Pregnancy` box**. Added:
  - Uncomplicated cystitis: Nitrofurantoin 5 days (2.4), Fosfomycin single dose (39), Trimethoprim 3 days (U);
  - Symptomatic relief: Panadol (46), Proximol (U), Vitamin C (12);
  - Pyelonephritis/complicated: Ceftriaxone 1 g IM (69), Cipro 500 (90), Augmentin 1 g (210).
- **Treatment +2:** do not treat asymptomatic bacteriuria (except pregnancy / pre-urologic procedure); men & complicating factors = complicated UTI.
- **Warning +4:** fever + rigors, oliguria, anuria, referral criteria.
- **Instructions +4:** fluids, no urinary retention, less salt.
- **perDrug +5:** Panadol → Cataflam 50 (55); Vitamin C → C-Retard (U); Ceftriaxone → Rocephin (120); Cipro → Ciprofloxacin (53); Augmentin → Hibiotic (U).
- **Pre-existing near-duplicate:** `rochetta-020` “Uncomplicated Lower UTI” sits in **Antibiotics**. It was left untouched (not part of this file) and is flagged in §10.

### `rochetta-069` Oral Problems (merge of cases 5 + 6)
- **Added boxes:** `…قرح الفم المتكررة` (BBC spray, Betadine MW, Supravit — all U) and `…مونيليا الفم` (Daktarin oral gel, BBC spray — U).
- **Warning +1:** treat predisposing factors for oral candidiasis.
- **Instructions +5:** 2-week ulcer review, glycaemic control, stop long antibiotics, rinse after inhaled steroids.
- Existing `RX` box (chlorhexidine, amoxicillin, nystatin, acyclovir) untouched.

---

## 4. CREATE cases — 17 new rows

Each mirrors the existing structure exactly: `id`, `title`, `subtitle`, `content` with `[DIAGNOSIS] [INVESTIGATIONS] [TREATMENT] [WARNING] [RX…]`, `category`, `chapterAr`, empty `alternatives`, `perDrugAlternatives`, `drugInstructions`, empty `drugInteractions` (field kept for shape parity), optional `related`.

| id | Title | Category | RX boxes | Priced | Unmatched |
|---|---|---|---|---|---|
| 073 | Chronic Gastritis | GIT | copied `022` bismuth-quadruple box + PPI-only box | Losec 27, Bismuth 8, Metronidazole 34, Tetracycline 8, Bispyller 800, Omez 20 | — |
| 074 | Typhoid (Enteric) Fever | Antibiotics | main + culture-guided alternatives | Zithromax 500 150, Panadol 46, Cipro 90 | Lactulose syrup, Cefixime 200, Azomycin 500 |
| 075 | Urinary Crystals, Gravel & Stones | Urinary | 3 salt-type boxes | — | Urosolvin, Epimag, Vitacid C |
| 076 | Trigeminal Neuralgia | Pain | 1 | Tegretol 80 | Mobic |
| 077 | Sciatica | Pain | 1 | Tegretol 80 | Mobic, Reparil gel, Myofen |
| 078 | Diabetic Neuropathy | Pain | 1 | Tegretol 80 | Mobic, Cobal, Betolvex, Trental |
| 079 | Cluster Headache | Pain | 1 | Cataflam 50 55 | Adolor amp |
| 080 | Memory Improvement | Psychiatry | 1 | — | Activate |
| 081 | Obesity & Weight Reduction | Others | 1 | — | Orlistat, Zocor, Omega 3 |
| 082 | Amoebiasis | GIT | vegetative + cyst + cyst alternative | Flagyl 34 | Furazole |
| 083 | Giardiasis | GIT | 1 | Flagyl 34 | — |
| 084 | Enterobiasis (Pinworm) | GIT | main + alternative | — | Fluvermal, white precipitate ointment, Bendax |
| 085 | Ancylostomiasis (Hookworm) | GIT | main + alternative | — | Fluvermal, Antiver |
| 086 | Ascariasis | GIT | 1 | — | Fluvermal |
| 087 | Hymenolepis nana | GIT | 1 | — | Niclosan |
| 088 | Bilharziasis (Schistosomiasis) | GIT | 1 | — | Praziquantel 600 |
| 089 | Taeniasis | GIT | main + alternatives | — | Praziquantel 600, Niclosan, Bendax |

`perDrugAlternatives` were added only where a priced alternative exists in the current data (e.g. Tegretol → Carbamazepine 35, Flagyl → Metronidazole 34, Zithromax 500 → Azomycin U, Panadol → Paracetamol 8, Lactulose → Duphalac 60, Cipro → Ciprofloxacin 53).

### `related` links (new optional field)

| From | To | Direction |
|---|---|---|
| 073 Chronic Gastritis | 022 H. pylori Eradication | **mutual** (022 → 073 added too) |
| 075 Urinary Crystals | 050 Renal Colic / Urolithiasis | one-way |
| 078 Diabetic Neuropathy | 010 Neuropathic Pain | one-way |

The schema had no field for this, so `related?: { id: string; label: string }[]` was added to `Prescription`, passed through `[id]/page.tsx`, and rendered as a **حالات ذات صلة** chip row in `CaseDetailClient.tsx`. One-way links avoid editing unrelated cases; say the word if you want 050/010 back-links too.

---

## 5. Prices used (all copied verbatim — nothing guessed)

Matched: Omez 20 = 20 · Losec 20 = 27 · Bismuth = 8 · Metronidazole = 34 · Tetracycline = 8 · Bispyller = 800 · Motilium = 100 · Coloverin A = 99 · Colchicine = 190 · Diclofenac 75 IM = 17 · Cataflam 75 IM = 100 · Cataflam 50 = 55 · Tegretol = 80 · Zithromax 250 = 120 · Zithromax 500 = 150 · Brufen 400 = 78 · Panadol 500 = 46 · Cipro 500 = 90 · Flagyl 500 = 34 · Nitrofurantoin = 2.4 · Fosfomycin = 39 · Vitamin C 500 = 12 · Ceftriaxone 1 g IM = 69 · Augmentin 1 g = 210.
Alternatives used: Afrin 5 · Augmentin 210 · Azithromycin 250 = 49.5 · Ibuprofen 400 = 6 · Diclofenac 75 = 17 · Voltaren 75 IM = 80 · Allopurinol 100 = 8 · Zyloprim 100 = 60 · Sumatriptan 50 = 90 · Domperidone GPO = 15 · Controloc 20 = 90 · Cataflam 50 = 55 · Rocephin 1 g = 120 · Ciprofloxacin 500 = 53 · Paracetamol 500 = 8 · Duphalac = 60 · Carbamazepine 200 = 35 · Brufen 400 = 78.

## 6. The source-error correction

Only **one** numeric error exists in the current instruction file, and it was corrected:

- **H. nana (`087`)** — source `Niclosamide 1st day: 2 mg` → implemented as **2 g**: `4 × 500 mg` on day 1, then `2 × 500 mg` for 6 days.

The Gout row in the same file already reads **Prednisone 30–40 mg/day PO × 5 days**; there is no `20–40 mg/kg` text to fix, so the line was implemented as written. (If you have an older copy that says `20–40 mg/kg`, that copy was not the file used here.)

## 7. Internal price conflicts in the existing data (kept verbatim, not “fixed”)

The 72-case file contradicts itself. Each conflict below was resolved by reusing the value from the case that owns the drug, and is recorded here so it can be cleaned in one pass later:

| Drug | Values found | Value used here |
|---|---|---|
| Colchicine 500 mcg | RX 190 vs perDrug `Colchicine 500mcg tab` 30 (both in 012) | 190 in RX, old 30 row kept |
| Coloverin A | RX/new box 99 vs old perDrug 25 | 99 for the new box; old 25 row kept |
| Motilium | 100 (065) vs 30 (066 perDrug) | 100 |
| Zithromax 500 | 150 (057) vs 55 (018) | 150 |
| Brufen 400 | 78 (049) vs Ibuprofen 400 = 6 | 78 (different brand) |
| Ceftriaxone 1 g IM | 69 vs 50 (021 perDrug) vs Rocephin 120 | 69 |
| Ciprofloxacin 500 | 53 / 69 (020) / 35 (020 perDrug) | 53 as alternative; Cipro 90 as main |
| Flagyl 500 | 34 (RX) vs 20 (064 perDrug) | 34 |

## 8. Interactions — suggested, **not added**

No interactions file exists, so `drugInteractions` was left unchanged (empty on all new rows). These are the 11 suggestions from the source file, for a later pass:

1. Clarithromycin + Simvastatin (Zocor) — avoid; rhabdomyolysis.
2. Colchicine + strong CYP3A4/P-gp inhibitors (clarithromycin) — toxicity; avoid/reduce dose.
3. Clarithromycin + Carbamazepine (Tegretol) — ↑ carbamazepine.
4. Colchicine + statins — myopathy.
5. Metronidazole (Flagyl) + alcohol — disulfiram-like reaction.
6. Tetracycline + antacids/calcium/iron/dairy — ↓ absorption; space doses.
7. Ciprofloxacin + antacids/iron/calcium — ↓ absorption; space doses.
8. Ciprofloxacin + NSAIDs — ↑ CNS stimulation / seizure risk.
9. Azithromycin + other QT-prolonging drugs — QT prolongation.
10. Sumatriptan + MAOIs / ergots — contraindicated.
11. Orlistat — ↓ fat-soluble vitamins; separate other drugs by 2 h.

## 9. `max_dose` gap and dose hints

`max_dose` does not exist in the schema and no ABCDrugs/guide is available, so **no** `md:` values were written. The source’s hints are recorded for verification later:

- Allopurinol: up to 800 mg/day · Sumatriptan: 200 mg/day · Pizotifen: 4.5 mg/day · Carbamazepine: 400–800 mg/day (trigeminal), 100–200 mg/12 h (sciatica) · Trental: 400 mg/8 h (see §10) · Orlistat: 120 mg TID.

## 10. Review items from §5-ب — recorded, text **not** changed

| Item | Status |
|---|---|
| ب-1 Giardiasis: mebendazole is not a usual alternative (tinidazole/albendazole are) | Text kept as in the source; recorded here. |
| ب-2 Trental 100 mg × 2 q8h = 200 mg, not 400 mg | RX kept as written (“قرصان كل 8 ساعات”); the 400 mg/8 h hint is not trusted. |
| ب-3 Zocor/Alkor in obesity only with dyslipidaemia | The new case’s warning already states this; no other text changed. |
| ب-4 “Hint” doses must be checked against ABCDrugs | Not verifiable here (no ABCDrugs); no hint was promoted to `max_dose`. |

## 11. Judgment calls

- **Cases 5 + 6 merged into `069`.** `069 Oral Problems` already covered aphthous ulcers, thrush, herpes and gingivitis; two new labelled RX boxes were appended instead of creating near-identical rows. If you prefer separate `Recurrent Aphthous Ulcer` and `Oral Candidiasis` pages, they can be split out as new ids.
- **`048` vs `020`.** Both are lower-UTI cases (`048` Urinary, `020` Antibiotics). `048` was updated (it is the Urinary-chapter case the file assigns to); `020` was left untouched to avoid unrelated edits. Consider deduping them in a later pass.
- **Additive vs replacing boxes.** `056/057/065/068/005/069` keep their existing boxes and get a new labelled source box. `012` and `048` replace only the boxes the source rewrites (old regimen superseded; `048`’s Pregnancy box kept).
- **Related links** are one-way except 073↔022.
- **`022`** content is byte-identical to before; only `related` was added to satisfy the required mutual link.
- **Per-drug rows:** two pre-existing rows in `065` and one in `068` were momentarily dropped by name-based deduplication and have been restored verbatim.

## 12. Verification

| Check | Result |
|---|---|
| `npm run validate` | ✔ 89 prescriptions, valid |
| `npx tsc --noEmit` | ✔ no errors |
| `npm run build` | ✔ exit 0, 122 static pages, 89 case pages |
| New pages `out/doctor/case/rochetta-073…089.html` | ✔ all present |
| `noindex` on case pages | ✔ present |
| Search index | ✔ new titles (Typhoid, Bilharziasis, …) present in `out/index.html` |
| Chapter counters | ✔ GIT 18, Pain 12, Psychiatry 9, Urinary 9, Antibiotics 8, Others 2 |
| Related block | ✔ renders on 073 and 022 |
| `npm run lint` | ✖ 4 errors in files **not touched by this batch** (`ImportClient.tsx`, `PortalLogin.tsx`, `PortalTopbar.tsx`, `categories/page.tsx`) — pre-existing in the working tree |

## 13. Files changed by this batch

- `src/data/prescriptions.json` — 17 new + 9 updated cases.
- `src/lib/types.ts` — optional `related` field.
- `src/app/doctor/case/[id]/page.tsx` — passes `related`.
- `src/components/CaseDetailClient.tsx` — renders the related-cases chip row.
- `scripts/validate-data.mjs` — category counts updated.
- `README.md` — 72 → 89 references.
- `BATCH1_REPORT.md` — this file.

**Nothing was committed, pushed, or deployed. Awaiting your review.**
