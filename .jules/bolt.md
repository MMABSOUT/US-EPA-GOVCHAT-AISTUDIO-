## 2025-05-18 - Deduplication in `importData` O(N^2) Bottleneck
**Learning:** Using `array.filter((item, index, self) => index === self.findIndex(...))` to deduplicate lists (conversations, folders, prompts) causes quadratic O(N^2) comparisons. For large exported datasets or accumulated history, this causes noticeable main-thread lag during import. Replacing it with a `Set` lookup helper improves time complexity to linear O(N).
**Action:** Always prefer `Set` or `Map` key tracking for array deduplication when array size can be large.
