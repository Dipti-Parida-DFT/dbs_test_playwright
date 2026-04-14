# Serial vs Parallel — Test Execution Modes

## Quick Summary

**Parallel** — Each test case is **independent**. TC01 and TC02 don't share any data.
They can run in any order or even at the same time.

**Serial** — TC02 **depends on TC01's output**. TC01 must run first and pass before
TC02 starts.

---

## Comparison

| | Parallel | Serial |
|---|---|---|
| **Dependency** | None — TCs are independent | TC02 needs data from TC01 |
| **Run order** | Any order | TC01 → TC02 strictly |
| **Shared variables** | None | `let referenceFromTC01: string` in describe scope |
| **Playwright config** | Default (no change) | `test.describe.configure({ mode: 'serial' })` |
| **Run Scope** | `new` (only run the new TC) | `all` (must run TC01 first to generate data) |
| **Failure impact** | TC01 fail doesn't affect TC02 | If TC01 fails, TC02 is skipped |

---

## Parallel Example

TC01 creates a payment with a **new payee**.
TC02 creates a payment with an **existing payee**.
Neither needs the other's output.

```typescript
test.describe('SG_AccountTransfer (Playwright)', () => {
  let pages: PaymentsPages;

  test.beforeEach(async ({ page }, testInfo) => {
    // Login, initialize page objects
  });

  test('TC01_Create an ACT Payment with new Payee', async ({ page }) => {
    // Creates payment independently
    // Reference: EBACT60414685399
  });

  test('TC02_Create an ACT Payment with existing Payee', async ({ page }) => {
    // Creates payment independently — does NOT need TC01's reference
    // Reference: EBACT60414685400
  });
});
```

**Prompt header:**
```
Mode: `append`
Execution Mode: `parallel`
Run Scope: `new`
```

**Execution command:** Only runs the new TC
```
npx playwright test spec-file.spec.ts -g "TC02" --headed --reporter=list
```

---

## Serial Example

TC01 creates a payment and captures the **reference number**.
TC02 uses that **exact reference** to search and reject the same payment.

```typescript
test.describe('SG_AccountTransfer (Playwright)', () => {
  test.describe.configure({ mode: 'serial' });  // ← Forces sequential execution

  let pages: PaymentsPages;
  // ─── Shared state between serial TCs ───
  let referenceFromTC01: string | undefined;  // Written by TC01, read by TC02

  test.beforeEach(async ({ page }, testInfo) => {
    // Login, initialize page objects
  });

  test('TC01_Create an ACT Payment', async ({ page }) => {
    // Creates payment, captures reference
    referenceFromTC01 = 'EBACT60414685399';
  });

  test('TC02_Reject ACT Payment via Transfer Center', async ({ page }) => {
    // Uses referenceFromTC01 from previous test
    await pages.TransferCentersPage.searchAndOpenByReference(referenceFromTC01!);
    // Reject the payment...
  });
});
```

**Prompt header:**
```
Mode: `append`
Execution Mode: `serial`
Run Scope: `all`
```

**Execution command:** Runs ALL TCs (TC01 must pass first to generate data for TC02)
```
npx playwright test spec-file.spec.ts --headed --reporter=list
```

---

## How to Decide

| Question | If Yes → | If No → |
|----------|----------|---------|
| Does TC02 use a reference/ID created by TC01? | **Serial** | Parallel |
| Does TC02 need TC01's payment to be in a specific status? | **Serial** | Parallel |
| Can TC02 run without TC01 ever running? | **Parallel** | Serial |
| Does TC02 search for TC01's transaction in Transfer Center? | **Serial** | Parallel |

---

## Your Current TCs

| Spec File | TC01 | TC02 | Mode |
|-----------|------|------|------|
| `SG_AccountTransferTC001AgentGenerated.spec.ts` | Create ACT with new Payee | Create ACT with ApprovalNow + M-Challenge | **Parallel** — both create independent payments |
