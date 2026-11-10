# Fonts

Self-hosted. No font is loaded from a CDN.

| File                                    | Family             | Use                               | Licence                                               |
| --------------------------------------- | ------------------ | --------------------------------- | ----------------------------------------------------- |
| `eb-garamond-latin-600-normal.woff2`    | EB Garamond 600    | Headings and card names (Latin)   | SIL OFL 1.1 (`EBGaramond-OFL.txt`)                    |
| `eb-garamond-cyrillic-600-normal.woff2` | EB Garamond 600    | Headings and card names (Russian) | SIL OFL 1.1                                           |
| `JetBrainsSans-Regular.woff2`           | JetBrains Sans 400 | Body and controls                 | **Licence file not recorded; confirm before release** |

- EB Garamond files come from the `@fontsource/eb-garamond` 5.3.0 npm package (OFL-1.1), Latin and Cyrillic subsets only, one weight, to keep the payload near 37 KB.
- JetBrains Sans ships only the regular weight, so bold text is synthesised by the browser. Add a bold file if that looks poor.
- Coverage was checked by reading each file's `cmap` against every non-ASCII character used in `src/`. Only the dev-only pseudo-locale marks `⟦⟧` are missing, and they fall back.
