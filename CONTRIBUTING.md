# Contributing to open.text

Thanks for contributing.

`open.text` is intentionally small. The goal is a stable, dependency-free text
analysis library, not a general NLP framework.

## Before changing code

1. Read `README.md`.
2. Read `AGENTS.md` if you are using an AI coding assistant.
3. Run the test suite.
4. Keep changes focused on the documented public contract.

## Development

```bash
npm test
```

The project intentionally has no runtime dependencies.

## Pull requests

A pull request should:

- explain the behavior being changed,
- include tests for new or corrected behavior,
- update documentation when the public API changes,
- avoid unrelated refactors,
- preserve browser and Node.js compatibility,
- avoid introducing dependencies unless there is a compelling reason.

## Design rule

A new feature belongs in `open.text` only if it is useful for plain-text
analysis without requiring knowledge of Markdown, HTML, a CMS, or another
application.
