# Token Consumption Tracking — Methodology & Implementation Guide

> **Purpose:** Explains how token usage is calculated during Protractor → Playwright migrations
> using the v04.1 prompt, so any team member can understand, verify, or refine the numbers.
>
> **Audience:** Anyone running migrations or reviewing migration reports.

---

## 1. Why Track Tokens?

Each migration session consumes LLM tokens (input + output) across many turns:
- Stage 1 conversion (reading source, generating spec)
- Stage 2 execution loop (running tests, reading errors, applying fixes, re-running)
- Post-pass activities (reporting, learnings, approvals)

Tracking tokens helps:
- Estimate cost per test case migration
- Compare migration complexity across TCs
- Identify optimization opportunities (e.g., reducing context size)
- Budget planning for large-scale migrations

---

## 2. The Estimation Formula

### Core Formula

```
Estimated Tokens = Character Count ÷ 4
```

This is the industry-standard approximation for English text and code:
- 1 token ≈ 4 characters (for English and most programming languages)
- Source: OpenAI tokenizer documentation, applicable to GPT and Claude models

### Per-Turn Calculation

For **each LLM turn** in the migration session:

```
Input Tokens  = (system_prompt_chars + user_message_chars + tool_results_chars) ÷ 4
Output Tokens = (assistant_response_chars + tool_call_chars) ÷ 4
```

### What Counts as Input (Prompt Tokens)

| Component | Description | Included? |
|-----------|-------------|-----------|
| System prompt | VS Code Copilot system instructions, tool definitions, workspace context | Yes |
| User message | The migration prompt text or follow-up instructions | Yes |
| Tool results | Output from file reads, terminal commands, search results, ARIA snapshots | Yes |
| Conversation history | Previous turns sent as context in multi-turn conversations | Yes |
| Attached files | Files attached via `@file` or workspace context | Yes |

### What Counts as Output (Completion Tokens)

| Component | Description | Included? |
|-----------|-------------|-----------|
| Assistant text | The visible response text | Yes |
| Tool calls | Function calls (file edits, terminal commands, searches) | Yes |
| Reasoning | Internal chain-of-thought (model-dependent, may not be visible) | Estimated |

---

## 3. Step-by-Step Tracking Process

### Step 1 — Initialize the Tracker

When the migration prompt is first received, create an in-memory tracker:

```
Token Consumption Tracker
═════════════════════════
Session Start: [timestamp]
Model: [model name, e.g., claude-opus-4.6]

| Turn # | Phase    | Est. Input Tokens | Est. Output Tokens | Cumulative Total |
|--------|----------|-------------------|--------------------|-----------------:|
```

### Step 2 — Log Each Turn

After every LLM response, append a row:

```
| 1 | Stage 1 — Read source file    | ~12,500 | ~800   | 13,300  |
| 2 | Stage 1 — Generate spec        | ~15,200 | ~4,500 | 33,000  |
| 3 | Stage 2 — Pre-flight audit     | ~18,000 | ~2,000 | 53,000  |
| 4 | Stage 2 — Run 1 (execute)      | ~20,000 | ~1,500 | 74,500  |
| 5 | Stage 2 — Run 1 (diagnose)     | ~22,000 | ~3,000 | 99,500  |
| ...                                                              |
```

**Note:** Input tokens grow with each turn because conversation history accumulates.

### Step 3 — Categorize by Phase

At the end of the session, group turns into phases:

```
Phase Breakdown:
  Stage 1 (Conversion):           Turns 1–3    →  ~53,000 tokens
  Stage 2 (Execution + Fix Loop): Turns 4–12   → ~180,000 tokens
  Post-Pass (Report + Approvals): Turns 13–15  →  ~45,000 tokens
  ─────────────────────────────────────────────────────────
  Total:                                         ~278,000 tokens
```

### Step 4 — Include in HTML Report (Section G)

The tracker data is rendered in the migration report as:
- Summary cards (Total Tokens, Input Tokens, Output Tokens)
- Per-phase breakdown table
- Per-turn tracking table with cumulative running total
- Models used
- Methodology note

---

## 4. How to Get Exact Token Counts (Optional)

The estimation formula (char ÷ 4) is sufficient for reporting, but if you need
**exact** numbers, use one of these methods:

### Method A — VS Code Developer Tools (Real-Time)

1. Open VS Code
2. Press `Ctrl+Shift+I` to open Developer Tools
3. Go to the **Network** tab
4. Start your migration
5. Filter requests by `copilot` or `completions`
6. Click on each request → **Response** tab
7. Look for the `usage` field:

```json
{
  "usage": {
    "prompt_tokens": 12450,
    "completion_tokens": 3200,
    "total_tokens": 15650
  }
}
```

8. Sum across all requests for the session total

### Method B — VS Code Output Panel

1. Open the Output panel (`Ctrl+Shift+U`)
2. Select **"GitHub Copilot Chat"** from the dropdown
3. Each request logs metadata including model and duration
4. Note: Token counts may not be displayed here depending on the extension version

### Method C — GitHub Copilot Usage API (Organization-Level)

For **Copilot Business/Enterprise** subscriptions, admins can query:

```
GET https://api.github.com/orgs/{org}/copilot/usage
```

Headers:
```
Authorization: Bearer <token>
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

This returns daily aggregated usage per seat, not per-session granularity.

### Method D — Copilot Chat Log File

VS Code writes a Copilot Chat log at:
```
%APPDATA%\Code\logs\<session>\<window>\exthost\GitHub.copilot-chat\GitHub Copilot Chat.log
```

Each request is logged with:
```
ccreq:<id>.copilotmd | success | <model> | <duration>ms | [<context>]
```

This gives you per-request model and duration, but **not** token counts directly.

---

## 5. Estimation Accuracy

### How Accurate is char ÷ 4?

| Content Type | Actual Ratio (chars/token) | char÷4 Error |
|-------------|---------------------------|--------------|
| English prose | ~4.0 | ±5% |
| TypeScript/JavaScript code | ~3.5–4.5 | ±10% |
| JSON data | ~3.0–3.5 | ~15% undercount |
| HTML (with tags) | ~3.5–4.0 | ±10% |
| Mixed (typical migration) | ~3.8 | ±8% |

**For migration sessions, expect ±10% accuracy** — close enough for cost estimation
and comparison across TCs.

### More Precise Alternatives

If you need better accuracy without Developer Tools:

1. **Use a tokenizer library** (offline, for post-hoc analysis):
   ```bash
   # Python — tiktoken (for GPT models)
   pip install tiktoken
   python -c "import tiktoken; enc = tiktoken.encoding_for_model('gpt-4o'); print(len(enc.encode(open('file.txt').read())))"
   ```

2. **Anthropic token counter** (for Claude models):
   ```bash
   pip install anthropic
   python -c "from anthropic import Anthropic; c = Anthropic(); print(c.count_tokens('your text here'))"
   ```

These are only useful for post-hoc analysis, not real-time tracking during a migration.

---

## 6. Typical Token Consumption by Migration Complexity

Based on TC01–TC07 migration patterns:

| Complexity | Runs | Est. Turns | Est. Total Tokens | Example |
|-----------|------|-----------|-------------------|---------|
| Low | 2–3 | 8–12 | 35K–60K | TC03 (ApprovalNow), TC07 (Copy) |
| Medium | 4–6 | 12–18 | 60K–120K | TC04 (Save Template), TC05 (From Template) |
| High | 7–12 | 18–30 | 120K–200K | TC01 (New Payee), TC02 (Existing Payee) |
| Very High | 15+ | 30–50 | 200K–400K | TC001 (initial migration with 21 runs) |

**Key cost drivers:**
- Number of retry runs (each run adds ~15K–25K tokens for error analysis + fix)
- Source test complexity (more steps = more context per turn)
- Conversation history growth (later turns carry all previous context)
- ARIA snapshot size (DOM dumps can be 5K–15K characters each)

---

## 7. Token Tracking in the Migration Prompt

The token tracking is defined in **migration-execution-prompt-04.md** (v04.1):

- **Location:** Right after "Record the wall-clock timestamp" in both Example 1 and Example 2
- **Report Section:** §2.9 Section G — Token Consumption (Estimated)
- **Summary Cards:** Section D includes "total estimated tokens consumed"

The tracking is **self-contained** — it uses the char ÷ 4 formula and requires no
external tools, API keys, or browser DevTools. Any machine running the prompt will
produce token estimates in the migration report.

---

## 8. Frequently Asked Questions

**Q: Does the agent actually count characters per turn?**
A: The agent estimates based on the content it processes. The accuracy depends on the
model's ability to track its own input/output sizes. The numbers are best-effort estimates.

**Q: Why not use exact API token counts?**
A: VS Code Copilot Chat does not expose the `usage` field from API responses to the
agent. The agent cannot programmatically access its own token consumption. The char ÷ 4
method is the only self-contained approach that works without external tooling.

**Q: Can I compare tokens across different models?**
A: Different models tokenize differently (GPT-4o vs Claude have different tokenizers).
The char ÷ 4 approximation normalizes this — it gives a comparable estimate regardless
of which model runs the migration.

**Q: Does conversation history inflate later turns?**
A: Yes. In a 20-turn migration, the last turn's input includes all previous messages.
This means later turns consume significantly more input tokens. The per-turn table in
the report makes this visible.

**Q: How do tool calls affect token count?**
A: Tool calls (file reads, terminal commands, searches) contribute to both:
- **Output tokens** — the tool call request itself
- **Input tokens** — the tool result returned to the model in the next turn
Large file reads and terminal outputs are the biggest contributors.
