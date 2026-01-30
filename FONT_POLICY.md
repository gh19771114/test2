# Font policy (license / language coverage)

This project intentionally avoids paid/proprietary webfont bundling.

## What is actually bundled and used

- **Bundled font file**: `public/fonts/NotoSansSC-Regular.ttf`
  - **Font**: Noto Sans SC (Simplified Chinese)
  - **License**: SIL Open Font License (OFL) — free for commercial use
  - **Used for**:
    - UI: injected via `next/font/local` in `app/layout.tsx` as CSS variable `--font-noto-sans-sc`
    - PDF generation: used by the server-side PDF routes/templates

## Language coverage strategy

- **Simplified Chinese / English**: primarily rendered with **Noto Sans SC** (bundled) plus system fallbacks.
- **Japanese / Traditional Chinese (HK/TW)**: the UI uses the same `font-family` stack and relies on system fallbacks
  where required glyphs are not covered by the bundled font.

If you want to fully self-host Japanese / Traditional Chinese fonts as well (still free for commercial use),
add the corresponding Noto fonts to `public/fonts/` and extend the `next/font/local` setup in `app/layout.tsx`.

