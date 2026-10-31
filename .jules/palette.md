# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-15 - Inline destructive confirmation actions require explicit ARIA semantics and unified touch targets
**Learning:** In sidebar workflows where a destructive action ("Clear conversations") switches inline into a confirmation prompt, icon-only buttons (`IconCheck`, `IconX`) without `aria-label` or `title` create severe barriers for screen reader users and keyboard navigators. Reusing the design system's `SidebarActionButton` provides consistent sizing, hover states, and ensures required accessibility properties (`title`, `aria-label`).
**Action:** When designing or refactoring inline action confirmations, always wrap confirmation triggers with descriptive `aria-label` and `title` attributes matching localized text, and provide an `aria-label` on the containing confirmation region.
