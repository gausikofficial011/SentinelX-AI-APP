---
name: SentinelX AI Design System
colors:
  surface: '#0d1515'
  surface-dim: '#0d1515'
  surface-bright: '#333b3b'
  surface-container-lowest: '#080f10'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#232b2c'
  surface-container-highest: '#2e3637'
  on-surface: '#dce4e4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dce4e4'
  inverse-on-surface: '#2a3232'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#fff6e4'
  on-tertiary: '#3b2f00'
  tertiary-container: '#fed83a'
  on-tertiary-container: '#725e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c423'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#0d1515'
  on-background: '#dce4e4'
  surface-variant: '#2e3637'
typography:
  display-lg:
    fontFamily: plusJakartaSans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: plusJakartaSans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: plusJakartaSans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: plusJakartaSans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system establishes a high-fidelity, tactical environment tailored for the high-stakes world of enterprise crime prediction. The aesthetic is a refined interpretation of the "Cyberpunk" genre—moving away from neon grime toward a "Safe" and authoritative command-center experience. It prioritizes clarity, mission-critical data visualization, and an atmosphere of proactive security.

The visual style utilizes **Glassmorphism** as its structural foundation, employing semi-transparent surfaces with backdrop blurs to create a sense of depth and advanced technology. The interface is punctuated by high-contrast accents and "Tactical Micro-interactions"—subtle scanlines, grid overlays, and telemetry markers—that evoke the feeling of a sophisticated AI-driven surveillance hub while maintaining the professional rigor required by enterprise users.

## Colors

The palette is anchored in a deep-space navy spectrum, providing a high-contrast backdrop for luminous functional accents. 

- **Primary Cyan (#00f2ff):** Used for critical paths, active states, and "safe" data points. It is the primary light source of the UI.
- **Electric Purple (#a855f7):** Represents AI-processed data, algorithmic inferences, and secondary navigational elements.
- **Warning Pink (#f43f5e):** Reserved strictly for high-probability crime alerts, errors, and urgent system notifications.
- **Backgrounds:** A transition from Deep Space Navy to Darker Navy creates a natural hierarchy, where the darkest tones represent the furthest "depths" of the interface.
- **Glassmorphic Surfaces:** Layers use a 80% opacity navy with a significant backdrop blur (12px+) to ensure legibility of the content over complex data visualizations.

## Typography

The typography system balances futuristic flair with enterprise-grade legibility. 

**Plus Jakarta Sans** is utilized for headlines to provide a soft, modern, and approachable geometric feel that offsets the aggressive technical nature of the theme. **Inter** serves as the workhorse for body text, ensuring that dense predictive data remains readable during extended use. **JetBrains Mono** is employed for technical metadata, timestamps, and coordinate data to reinforce the "Tactical Command" narrative.

Large display headings should utilize "All Caps" sparingly for section headers to evoke a military-technical aesthetic without sacrificing accessibility.

## Layout & Spacing

The layout philosophy follows a **4px baseline grid** to ensure mathematical precision in element alignment. On mobile devices, a fluid 12-column grid is condensed into a single-column stack with 16px side margins. On larger tablet and desktop views, the layout expands to reveal a multi-pane dashboard structure.

Spacing is tight and efficient, reflecting the information density of a professional command center. Use large padding (`xl`) only for top-level container boundaries; internal components should use compact spacing (`sm` to `md`) to keep related data points proximal.

## Elevation & Depth

Elevation is conveyed through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows. 

1.  **Base Layer:** Deep Space Navy (#030712) with a subtle grid pattern overlay (20px intervals, 5% opacity).
2.  **Surface Layer:** Semi-transparent navy containers with a 1px border. The border uses the Primary Cyan at 30% opacity to create a "wireframe" feel.
3.  **Active Layer:** Elements that are being hovered or selected gain a primary-colored "outer glow"—a soft, diffused drop shadow (blur: 15px, spread: -2px) using the Primary Cyan at 40% opacity.
4.  **Overlay Layer:** Modals and urgent alerts sit on top of all layers with a heavy backdrop blur (20px) to completely isolate the user's focus.

## Shapes

The shape language is "Soft-Tactical." By using a **0.25rem (4px) base corner radius**, the design system maintains a precise, engineering-focused look while avoiding the harshness of a pure 0px system. 

Larger containers (Cards, Modals) use `rounded-lg` (8px), while buttons and interactive inputs use the standard 4px radius. Status indicators (beacons) and user avatars are the only exceptions, utilizing a full "Pill" radius to distinguish them as organic or living elements within the rigid grid.

## Components

### Buttons
Buttons are primary interaction points. 
- **Primary:** Filled with Primary Cyan, text in Background Navy. No roundedness beyond the base 4px. Use a subtle "glitch" animation on hover.
- **Secondary:** Transparent with a 1px Cyan border. Text in Cyan.
- **Tactical:** Small, icon-only buttons with a crosshair icon or technical symbol.

### Cards
Cards use the glassmorphic style. Each card should feature a "header bar"—a 2px thick horizontal line in Primary Cyan at the very top. Inside the card, data is organized using the Mono font for labels and Inter for values.

### Input Fields
Inputs are dark with a 1px bottom border only (Primary Cyan). On focus, the border glows and a faint scanline animation moves vertically across the input area. Labels should be in `label-mono` and positioned above the field.

### Status Beacons
For crime prediction alerts, use a "pulsing" beacon. This is a small circle using the Warning Pink with an infinite scale-and-fade animation (the "ping") to indicate active monitoring or an ongoing threat.

### Telemetry & Crosshairs
Incorporate non-interactive decorative elements such as "L-shaped" corner brackets around featured images or map sections. Add small coordinate strings (e.g., `LAT: 40.7128 | LON: 74.0060`) in `label-mono` near the edges of major containers to reinforce the tactical theme.