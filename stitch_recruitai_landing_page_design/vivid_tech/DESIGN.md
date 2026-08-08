---
name: Vivid Tech
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#00534a'
  on-tertiary: '#ffffff'
  tertiary-container: '#006d62'
  on-tertiary-container: '#69f1de'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-margin: 24px
  gutter: 20px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a high-growth AI recruitment platform, balancing the authority of enterprise software with the energy of a consumer startup. The brand personality is vibrant and confident, aiming to reduce the anxiety of the hiring process through encouraging and tech-forward visuals.

The aesthetic blends **Modern Corporate** structure with **Glassmorphism** and **High-Contrast Bold** elements. It utilizes deep layering, background blurs, and vibrant gradients to create a sense of depth and intelligence. The UI should feel reactive and alive, suggesting the "engine" of AI working behind the scenes.

## Colors

The palette is anchored by a "Power Gradient" from Deep Indigo to Electric Blue, symbolizing the fusion of deep learning and high-speed execution. 

- **Light Mode:** Focuses on an "Airy" experience. Uses `#F8FAFC` for page backgrounds with pure white surfaces. Borders should be ultra-thin and low-contrast (`#E2E8F0`).
- **Dark Mode:** Focuses on "Sophisticated Depth." Page backgrounds use `#020617` (Deep Navy). Surfaces use a semi-transparent glass effect to allow the "Glow" gradients to bleed through from behind cards.
- **Teal Accents:** Used exclusively for success states, progress indicators, and AI-driven insights to provide a "calming" contrast to the energetic blues.

## Typography

This design system uses a high-contrast typographic pairing. **Montserrat** is used for headlines to convey confidence and modernism with its geometric construction. **Inter** is used for all functional and body text to ensure maximum legibility and a systematic feel.

For "Display" levels, use tighter letter spacing to create a compact, "funded startup" look. Body text should maintain a generous line height (1.5–1.6) to keep the UI feeling "Airy" even when data-dense.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop and a **single-column fluid layout** for mobile. 

- **Desktop:** 24px outer margins with a maximum container width of 1280px. 
- **Mobile:** 16px outer margins.
- **Spacing Rhythm:** Based on a 4px scale. Use `stack-lg` (32px) for spacing between distinct card elements and `stack-md` (16px) for internal padding within cards to maintain the "Rounded" aesthetic without feeling cramped.

## Elevation & Depth

Visual hierarchy is established through a mix of **Tonal Layers** and **Glassmorphism**.

1.  **Level 0 (Background):** Neutral base color. In dark mode, this level features subtle radial "glow" gradients in the corners.
2.  **Level 1 (Cards):** White (Light) or 40% Opacity Navy (Dark). Includes a `24px` blur and a 1px inner stroke (White at 10% opacity) to catch the light.
3.  **Level 2 (Floating/Hover):** When hovered, cards should scale by 1.02x and gain a "Soft Layered Shadow" (0px 20px 40px rgba(0,0,0,0.1)).
4.  **Level 3 (Modals/Popovers):** High-opacity glass with a distinct outer glow matching the primary indigo color at 20% opacity.

## Shapes

The design system uses a pronounced rounded language to feel approachable and modern. 
- **Cards & Containers:** 24px (rounded-xl) for large surface areas.
- **Interactive Elements:** 12px (rounded-lg) for buttons and inputs, creating a slightly sharper look than the containers they sit in to signify "utility."
- **Progress Elements:** ATS scores and status indicators should use perfect circles to contrast against the rectangular grid.

## Components

### Buttons
Primary buttons use the Indigo-to-Blue gradient with white text. They feature a `0px 4px 12px rgba(79, 70, 229, 0.3)` shadow. On hover, the gradient should shift slightly in hue. Secondary buttons use a glass background with a primary color border.

### ATS Score Ring
A custom circular progress component. The "track" is a low-opacity version of the Teal accent. The "indicator" is a thick stroke using the primary gradient. Center the numerical score using `headline-md`.

### Cards
Cards are the primary container. They must have `background-blur-lg`. In Dark Mode, add a 1px top-border (linear-gradient(to right, white at 20%, transparent)) to simulate a light-catch on the glass edge.

### Input Fields
Inputs use a "Soft" style. Backgrounds are slightly off-base color (light grey in light mode, deeper navy in dark mode). On focus, the border transitions to the primary indigo with a 2px outer glow.

### Chips & Badges
Small, pill-shaped elements with 10% opacity fills of the primary or teal color. Text should be `label-sm` for high-density information.