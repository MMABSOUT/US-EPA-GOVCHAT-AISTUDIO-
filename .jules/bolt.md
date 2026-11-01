## 2025-05-18 - Unstable Math.random() keys defeat React.memo in markdown components
**Learning:** Supplying `key={Math.random()}` to markdown components (such as `CodeBlock`) forces React to discard the component fiber, unmount the DOM tree, and re-instantiate the component on every render, completely defeating `React.memo` and triggering repeated expensive operations (like Prism syntax highlighting tokenization).
**Action:** Let React use its default reconciliation position or provide a deterministic key based on component props/indices rather than random numbers.
