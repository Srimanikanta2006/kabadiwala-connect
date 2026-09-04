# RE:LINK Design System (Stitch)
**Project:** Kabadiwala Connect  
**Device Target:** Android Mobile (Low-literacy, vernacular-first, offline-tolerant)  
**Brand Identity:** Dependable, Industrial, Empowering, High-Contrast

---

## 1. Design Philosophy & Guidelines
The design system is built to bridge the gap between informal labor sectors and formal industrial recycling. The brand personality is **dependable, industrial, and empowering**. It facilitates high-stakes transactions (waste for money) for users who may have limited digital literacy or lower-end mobile hardware.

The design style is **Simplified Modern / Industrial Material**. It utilizes the structural clarity of Material Design—specifically the use of tactile feedback, high elevation contrast, and large touch targets (minimum 48px, preferred 56px).

### Core Interaction Principles:
1. **Size over Style:** Body text never drops below 16px to ensure readability on small, low-resolution screens.
2. **Visual Hierarchy:** Large, bold pictorial icons with bilingual labels (English + Hindi / Marathi).
3. **Indic Typography Support:** Line height for Devanagari scripts (Hindi/Marathi) is increased by 20% relative to the English baseline to prevent vowel markers (*matras*) from clipping.
4. **Audio Proximity:** Any text instruction or critical valuation has an adjacent audio speaker button within 8px.
5. **High-Contrast Cards:** 1px solid border (`#E5E7EB`) on cards to ensure visibility on low-contrast LCD screens.

---

## 2. Color Palette Tokens

```css
:root {
  /* Primary - Emerald Green (Sustainability, Value, Success) */
  --color-primary: #006948;
  --color-primary-container: #00855d;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #f5fff7;
  --color-primary-fixed: #85f8c4;

  /* Secondary - Industrial Slate Metal */
  --color-secondary: #555f6d;
  --color-secondary-container: #d6e0f1;
  --color-on-secondary: #ffffff;
  --color-on-secondary-container: #596372;

  /* Tertiary - Deep Cyan / Audio & Info */
  --color-tertiary: #00647c;
  --color-tertiary-container: #007f9d;
  --color-on-tertiary: #ffffff;

  /* Surfaces & Backgrounds */
  --color-background: #f8f9fa;
  --color-surface: #f8f9fa;
  --color-surface-dim: #d9dadb;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f3f4f5;
  --color-surface-container: #edeeef;
  --color-surface-container-high: #e7e8e9;
  --color-surface-container-highest: #e1e3e4;
  --color-on-surface: #191c1d;
  --color-on-surface-variant: #3d4a42;

  /* Hazard & Error Semantics */
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;
  --color-on-error: #ffffff;
  --color-on-error-container: #93000a;
  --color-warning: #d97706;
}
```

---

## 3. Typography Hierarchy

| Style Token | Font Family | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-lg` | Inter / Noto Sans Devanagari | 32px | 700 | 40px | Screen titles, Main totals |
| `headline-lg-mobile` | Inter / Noto Sans Devanagari | 26px | 700 | 32px | Mobile headers |
| `headline-md` | Inter / Noto Sans Devanagari | 20px | 600 | 28px | Section headings |
| `body-lg` | Inter / Noto Sans Devanagari | 18px | 400 | 26px | High-priority body copy |
| `body-md` | Inter / Noto Sans Devanagari | 16px | 400 | 24px | Standard body / descriptions |
| `label-lg` | Inter / Noto Sans Devanagari | 16px | 600 | 20px | Button labels, Card titles |
| `label-md` | Inter / Noto Sans Devanagari | 14px | 500 | 18px | Secondary labels, badges |
| `action-xl` | Inter / Noto Sans Devanagari | 20px | 700 | 24px | Main bottom CTA action bar |

---

## 4. Spacing, Shapes & Elevation

- **Unit Base:** 4px
- **Mobile Margin:** 16px
- **Card Gutters:** 12px
- **Touch Target Minimum:** 48px (Recommended 56px for primary actions)
- **Border Radius:**
  - Small elements: 4px (`rounded-sm`)
  - Standard cards: 8px (`rounded-DEFAULT`)
  - Category Selection Cards: 12px (`rounded-md` / `rounded-lg`)
  - Action CTAs / Badges: Pill / 9999px or 8px
- **Elevations:**
  - Level 0: Flat background `#F8F9FA`
  - Level 1: Information cards with `0 1px 3px rgba(0,0,0,0.08)` + `1px solid #E5E7EB`
  - Level 2: Primary action buttons and sticky bottom bars with `0 4px 6px -1px rgba(0,0,0,0.1)`
