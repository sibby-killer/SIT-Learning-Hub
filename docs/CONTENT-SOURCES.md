# SIT Learning Hub - Content and Source Verification Record

**Purpose:** track what curriculum and examination material is verified, where it came from, and what may be published.  
**Rule:** absence of a record means "not verified", not "approved".  
**Last checked:** 2026-11-02

---

## 1. Principles

1. MMUST is the primary source for MMUST curriculum and examination questions.
2. Other universities may supplement the bank only when questions genuinely match verified learning outcomes.
3. Never label another institution's question as an MMUST question.
4. Do not fabricate units, learning outcomes, notes, examination papers, marks, or test results.
5. Do not publish draft/AI-generated educational content as verified official material.
6. Do not import an entire repository indiscriminately.
7. Preserve original documents unchanged; extracted questions are separate records with provenance.
8. Keep repeated questions; link them into clusters; never delete occurrences.
9. Respect copyright, repository terms, and access controls.
10. Do not claim a repository is fully covered until its relevant collections have been checked.

---

## 2. Initial curriculum scope (from the PRD)

The PRD states the initial scope is:

- Year 1 Semester 1
- Year 1 Semester 2
- Year 2 Semester 1

The PRD lists these units, explicitly flagging that they were identified from previous timetable information and **must be verified against official MMUST documentation before publication**:

| Code | Title (as listed) | Verification status | Notes |
| --- | --- | --- | --- |
| BIT 111 | Discrete Structures for IT | **Unverified** | Do not publish as official until confirmed |
| BIT 114 | Electronics Principles | **Unverified** | Confirm semester/programme |
| BIT 115 | Principles of Financial Accounting | **Unverified** | Confirm semester/programme |
| BCS 111 | Introduction to Programming | **Unverified** | Proposed pilot unit; still requires verification |
| MMU 111 | Fundamentals of Digital Competency | **Unverified** | Confirm code/title |
| ESM 111 | Quantitative Skills 1 | **Unverified** | Confirm semester |
| MAT 121 | Differential Calculus | **Unverified** | Confirm year/semester |

The list may be incomplete. Do not assume every unit belongs to the stated semester.

### What is needed to publish real curriculum

- Official MMUST programme structure or curriculum map.
- Official unit codes, titles, credits, semesters, and prerequisites.
- Unit outlines/learning outcomes where available.
- Academic year/semester definitions and dates.
- Confirmation of the programme name/code for the School of Information Technology.
- Approval from the appropriate MMUST academic/content owner.

Until then:

- Seed records must be labelled `draft` / `unverified`.
- Students must not see unverified units as official.
- The pilot unit's educational notes may be authored as clearly labelled drafts, but must not claim to be official MMUST material.

**Status:** [ ] official programme structure received  [ ] unit list verified  [ ] semester mapping verified  [ ] content owner identified

---

## 3. Examination repositories

### 3.1 Source priority

**Primary**

1. MMUST Examination Bank.
2. MMUST Library and institutional repositories.
3. Other official MMUST educational repositories.

**Secondary**

1. Other Kenyan university repositories.
2. Recognised universities with comparable curricula, only where questions genuinely match verified outcomes.

### 3.2 Repository inventory

| Institution | Repository | URL | Type | Access status (2026-11-02) | Use |
| --- | --- | --- | --- | --- | --- |
| MMUST | Exam Bank | https://exambank.mmust.ac.ke/ | DSpace-like (`/xmlui` referenced in PRD) | DNS resolves; TCP 80/443 timed out from this network | Primary; blocked pending access |
| MMUST | Library | https://library.mmust.ac.ke | Library site | Reachable; links to exam bank | Discovery/primary |
| Meru University | Exam Papers | https://exampapers.must.ac.ke | Repository | Transport error from this network | Secondary only |
| Murang'a University | Exams Bank | https://exambank.mut.ac.ke/xmlui | DSpace | Reachable; 4,179 past papers listed at inspection | Secondary only, labelled |

**Corrections to the PRD URLs:** the PRD's URLs are missing punctuation (for example `httpsexambank.mmust.ac.kexmlui`). The corrected starting points are above. Do not assume the PRD's example bitstream URL is valid; discover actual collection structures and identifiers.

### 3.3 Access notes

- MMUST Exam Bank may require a campus network, VPN, or institutional login. Try from the MMUST network if possible.
- Do not bypass authentication, CAPTCHAs, rate limits, or access controls.
- If the bank is unavailable, the user may provide PDFs or an offline archive.
- Repository metadata may be available without downloading files; record it first.
- Check robots.txt, terms of use, and copyright statements before bulk fetching.
- DSpace repositories often expose OAI-PMH and REST APIs; discover them rather than scraping HTML.

**Status:** [ ] MMUST access confirmed  [ ] OAI-PMH/REST endpoint documented  [ ] permission to store PDFs confirmed  [ ] sample papers obtained

---

## 4. Academic year filter

Initial rule from the PRD: use the last three **completed** academic years.

- Determine completed years from the current date and actual repository metadata.
- Do not include an incomplete academic year just because it has started.
- Store the actual academic year and examination session.
- Make the range configurable by administrators.
- Record the filter applied to each import run.

**Open question:** MMUST's academic year/session naming convention. Do not guess; verify from documents.

---

## 5. Source document record (required for every import)

Before importing, create a source inventory record with:

- Institution.
- Repository.
- Collection.
- Unit (verified mapping or `unmapped`).
- Academic year.
- Examination session.
- Document title.
- Document URL or repository identifier.
- Access status (public/restricted/unknown).
- File format.
- Import status.
- Review status.
- Licence/copyright notes.
- Retrieval date and checksum.

Do not mark `imported` until the file is stored and checksum-verified. Do not mark `reviewed` until a human has checked OCR, marks, diagrams, and mapping.

---

## 6. Extraction and review rules

1. Preserve the original PDF unchanged.
2. Record page numbers, question numbers, subquestion labels, marks, tables, equations, circuits, and diagrams.
3. Use OCR only where needed; retain raw OCR text and confidence.
4. Flag uncertain OCR for manual review.
5. Do not silently discard a diagram because text extraction failed; use page images.
6. Exclude irrelevant cover material from the question dataset but keep paper-level instructions as metadata when they affect the exam.
7. LLM-assisted extraction is a draft; a human verifies before publication.
8. Mapping must use actual learning outcomes, not similar unit titles.
9. Only approved HIGH-confidence and reviewed MEDIUM-confidence mappings enter the main bank.
10. LOW-confidence questions remain separate.
11. Keep all duplicate occurrences and explain cluster membership.
12. Do not claim repeated concepts predict future examinations.

---

## 7. Content quality record

For every published unit/topic/resource, record:

- Author.
- Reviewer.
- Version.
- Publication status.
- Last updated date.
- Source information.
- Whether content is official, institution-reviewed, or AI-generated draft.
- Review notes and approval date.

Draft content must never appear as verified learning material. AI-generated explanations must be labelled and distinguished from official course materials.

---

## 8. What the project owner needs to provide

Highest priority:

1. Access to the MMUST Exam Bank from campus/VPN, or a set of PDFs for the pilot units.
2. Official programme structure/curriculum map for the School of Information Technology.
3. Confirmation of the pilot unit and semester.
4. Permission/licence position for storing and displaying past papers.
5. Any existing notes, unit outlines, or learning outcomes that may be used.
6. Institutional branding/design constraints, if any.
7. Privacy/data-retention requirements from MMUST.

Without items 1-3, real curriculum and exam-bank publication remains blocked. The platform can still be built with clearly labelled sample/draft data.

---

## 9. Verification log

| Date | Item | Source | Result | Verified by |
| --- | --- | --- | --- | --- |
| 2026-11-02 | Repository is empty | GitHub API, `git ls-remote`, local directory | Confirmed empty | Audit |
| 2026-11-02 | MMUST Library reachable | https://library.mmust.ac.ke | Reachable | Audit |
| 2026-11-02 | MMUST Exam Bank reachable | https://exambank.mmust.ac.ke/ | DNS resolves; TCP timeout | Audit |
| 2026-11-02 | Meru exam papers reachable | https://exampapers.must.ac.ke | Transport error | Audit |
| 2026-11-02 | MUT exam bank reachable | https://exambank.mut.ac.ke/xmlui | Reachable; 4,179 items listed | Audit |
| 2026-11-02 | Curriculum units | PRD only | Unverified; do not publish | Audit |

---

## 10. Change log

- **2026-11-02:** Initial source record created. No curriculum or examination content has been imported, extracted, or published.
