## 2026-03-30 - Array deduplication complexity optimization
**Learning:** Found O(N^2) `.filter((item, index, self) => index === self.findIndex(...))` array deduplication pattern during `importData` operations. Replacing with a `Set`-backed linear pass `deduplicateById` improves computational efficiency to O(N).
**Action:** Use `Set` data structure for deduplicating arrays of unique-keyed objects instead of quadratic `.filter` + `.findIndex` searches.
