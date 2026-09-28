# AI agent guidance

AI-assisted contributions are allowed, but the contributor remains responsible
for correctness, scope, tests, security, accessibility where relevant, and
understanding the change.

Before editing:

1. Read `README.md`, `CONTRIBUTING.md`, and the relevant tests.
2. Inspect the current implementation instead of assuming planned behavior exists.
3. Restate the exact scope you intend to change.
4. Identify affected public API behavior and edge cases.

During implementation:

- Keep `open.text` dependency-free unless a maintainer explicitly approves otherwise.
- Do not add Markdown, HTML, NLP, sentiment, keyword extraction, or CMS-specific behavior.
- Preserve strict string input validation.
- Preserve Unicode-aware behavior.
- Prefer platform APIs such as `Intl.Segmenter` with documented fallbacks.
- Add or update tests with every behavior change.
- Avoid unrelated refactors.

Completion reports should include:

- what changed,
- files affected,
- tests run,
- remaining limitations or follow-up work.
