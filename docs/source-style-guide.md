# Creon Source Style Guide

This document describes the visual system implemented in `creon-web`. It is an
inventory of the source as it exists on branch `dev` at commit `53cf513`; it is
not a redesign proposal.

Every finding includes its defining source file and the relevant variable,
symbol, or class. Values supplied by Tailwind rather than declared directly in
the repository are marked as dependency defaults and are tied to Tailwind
`4.3.2`, the version in `package.json`.

## System baseline

| Finding                                                                                                                                                                                             | Source                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The component preset is shadcn `radix-lyra`, using CSS variables and the neutral base palette.                                                                                                      | `components.json` — `"style": "radix-lyra"`, `"baseColor": "neutral"`, `"cssVariables": true`                                                                                                                                                                   |
| The component primitives are Radix-based and support React Server Components.                                                                                                                       | `components.json` — `"style": "radix-lyra"`, `"rsc": true`; individual primitives import from `radix-ui`                                                                                                                                                        |
| Tailwind is CSS-first v4; there is no Tailwind configuration file.                                                                                                                                  | `components.json` — `"tailwind.config": ""`, `"tailwind.css": "src/app/globals.css"`; `package.json` — `tailwindcss: ^4.3.2`                                                                                                                                    |
| The overall visual character is neutral, compact, border-led, and predominantly square-cornered.                                                                                                    | `src/app/globals.css` — neutral OKLCH tokens; `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants` uses `text-xs rounded-none border`; `src/shared/components/shadcn-ui/card.tsx` — `Card` uses `rounded-none ring-1`                                |
| Light and dark themes are class-driven, default to the operating-system preference, and can be toggled with the `D` key when Meta, Ctrl, and Alt are not held and focus is outside typing controls. | `src/shared/components/provider/theme-provider.tsx` — `ThemeProvider` has `attribute="class"`, `defaultTheme="system"`, `enableSystem`; `ThemeHotkey.onKeyDown` checks `event.key?.toLowerCase() === "d"`, `event.metaKey`, `event.ctrlKey`, and `event.altKey` |

## 1. Color tokens and semantic usage

### Core surface and action tokens

The color system uses OKLCH CSS custom properties. Tailwind aliases are exposed
through the `@theme inline` block as `--color-*`, which produces utilities such
as `bg-background`, `text-muted-foreground`, and `border-input`.

| Token                                    | Light value                             | Dark value                              | Intended use and implementation evidence                                                                                                              | Exact source                                                                                                                                                                                                                                               |
| ---------------------------------------- | --------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`                           | `oklch(1 0 0)`                          | `oklch(0.145 0 0)`                      | Page and app background; applied globally with `bg-background`.                                                                                       | `src/app/globals.css` — `:root --background`, `.dark --background`, `@theme --color-background`, `body @apply bg-background`                                                                                                                               |
| `--foreground`                           | `oklch(0.145 0 0)`                      | `oklch(0.985 0 0)`                      | Default text and high-contrast UI.                                                                                                                    | `src/app/globals.css` — `:root/.dark --foreground`, `@theme --color-foreground`, `body @apply text-foreground`                                                                                                                                             |
| `--card` / `--card-foreground`           | `oklch(1 0 0)` / `oklch(0.145 0 0)`     | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Contained data and content surfaces.                                                                                                                  | `src/app/globals.css` — `--card`, `--card-foreground`; `src/shared/components/shadcn-ui/card.tsx` — `Card` classes `bg-card text-card-foreground`                                                                                                          |
| `--popover` / `--popover-foreground`     | `oklch(1 0 0)` / `oklch(0.145 0 0)`     | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Floating menus and overlays.                                                                                                                          | `src/app/globals.css` — `--popover`, `--popover-foreground`; `src/shared/components/shadcn-ui/popover.tsx` — `PopoverContent` classes `bg-popover text-popover-foreground`                                                                                 |
| `--primary` / `--primary-foreground`     | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.922 0 0)` / `oklch(0.205 0 0)` | Highest-emphasis actions and selected controls.                                                                                                       | `src/app/globals.css` — `--primary`, `--primary-foreground`; `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.default` is `bg-primary text-primary-foreground`                                                                       |
| `--secondary` / `--secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`  | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Lower-emphasis filled actions and badges.                                                                                                             | `src/app/globals.css` — `--secondary`, `--secondary-foreground`; `src/shared/components/shadcn-ui/badge.tsx` — `badgeVariants.variant.secondary`                                                                                                           |
| `--muted` / `--muted-foreground`         | `oklch(0.97 0 0)` / `oklch(0.556 0 0)`  | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` | Subdued surfaces, metadata, placeholders, hover rows, skeletons.                                                                                      | `src/app/globals.css` — `--muted`, `--muted-foreground`; `src/shared/components/shadcn-ui/skeleton.tsx` — `animate-pulse bg-muted`; `src/shared/components/shadcn-ui/input.tsx` — `placeholder:text-muted-foreground`                                      |
| `--accent` / `--accent-foreground`       | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`  | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Focused menu and select items.                                                                                                                        | `src/app/globals.css` — `--accent`, `--accent-foreground`; `src/shared/components/shadcn-ui/select.tsx` — `SelectItem` classes `focus:bg-accent focus:text-accent-foreground`                                                                              |
| `--destructive`                          | `oklch(0.577 0.245 27.325)`             | `oklch(0.704 0.191 22.216)`             | Errors, rejection, cancellation, and destructive actions. There is no separate `--destructive-foreground`; tinted backgrounds use `text-destructive`. | `src/app/globals.css` — `--destructive`; `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.destructive` uses `bg-destructive/10 text-destructive`; `src/shared/components/shadcn-ui/field.tsx` — `FieldError` uses `text-destructive` |
| `--border`                               | `oklch(0.922 0 0)`                      | `oklch(1 0 0 / 10%)`                    | Default separators and outlines.                                                                                                                      | `src/app/globals.css` — `--border`, base rule `* { @apply border-border }`; `src/shared/components/shadcn-ui/table.tsx` — `TableRow` class `border-b`                                                                                                      |
| `--input`                                | `oklch(0.922 0 0)`                      | `oklch(1 0 0 / 15%)`                    | Form-control borders, disabled fills, and the scrollbar thumb.                                                                                        | `src/app/globals.css` — `--input`, scrollbar `background: var(--input)`; `src/shared/components/shadcn-ui/input.tsx` — `border-input`, `disabled:bg-input/50`, `dark:bg-input/30`                                                                          |
| `--ring`                                 | `oklch(0.708 0 0)`                      | `oklch(0.556 0 0)`                      | Keyboard focus indicators.                                                                                                                            | `src/app/globals.css` — `--ring`, base `outline-ring/50`; `src/shared/components/shadcn-ui/button.tsx` — `focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50`                                                                       |

### Domain status tokens

These tokens extend the monochrome base with restrained semantic color. Their
raw color is normally used at 5–10% for backgrounds, 30–50% for borders, and at
full strength for text.

| Token                  | Light value                | Dark value               | Semantic use                                                       | Exact source                                                                                                                                                                                                                                    |
| ---------------------- | -------------------------- | ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--subtle`             | `oklch(0.556 0 0)`         | `oklch(0.708 0 0)`       | Neutral, inactive, draft, or pending status.                       | `src/app/globals.css` — `--subtle`, `--color-subtle`; `src/modules/milestone/components/milestone-status-badge.tsx` — `DRAFT`/`PENDING` classes `border-subtle/40 bg-subtle/10 text-subtle-foreground`                                          |
| `--subtle-foreground`  | `oklch(0.269 0 0)`         | `oklch(0.922 0 0)`       | Legible neutral-status text.                                       | `src/app/globals.css` — `--subtle-foreground`, `--color-subtle-foreground`; `src/modules/proposal/components/status-badge.tsx` — `DRAFT` class `text-subtle-foreground`                                                                         |
| `--info`               | `oklch(0.623 0.214 255.1)` | `oklch(0.65 0.20 255.1)` | In-progress, voting, and informational status.                     | `src/app/globals.css` — `--info`, `--color-info`; `src/modules/kyc/components/kyc-status-alert.tsx` — `PENDING.wrapperClass` has `border-info/30 bg-info/5`; `src/modules/milestone/components/milestone-status-badge.tsx` — `VOTING`           |
| `--info-foreground`    | `oklch(0.45 0.18 255)`     | `oklch(0.75 0.18 255)`   | Information/status text.                                           | `src/app/globals.css` — `--info-foreground`, `--color-info-foreground`; `src/modules/milestone/components/milestone-status-badge.tsx` — `text-info-foreground`                                                                                  |
| `--warning`            | `oklch(0.75 0.18 65)`      | `oklch(0.78 0.18 65)`    | Attention-required, submitted, releasing, and under-review status. | `src/app/globals.css` — `--warning`, `--color-warning`; `src/modules/kyc/components/kyc-status-alert.tsx` — `NOT_SUBMITTED.wrapperClass` has `border-warning/30 bg-warning/5`; `src/modules/proposal/components/status-badge.tsx` — `SUBMITTED` |
| `--warning-foreground` | `oklch(0.5 0.18 55)`       | `oklch(0.88 0.16 75)`    | Warning/status text.                                               | `src/app/globals.css` — `--warning-foreground`, `--color-warning-foreground`; `src/modules/milestone/components/milestone-status-badge.tsx` — `RELEASING` class `text-warning-foreground`                                                       |
| `--success`            | `oklch(0.65 0.18 145)`     | `oklch(0.68 0.18 145)`   | Approved, live, released, claimed, and completed status.           | `src/app/globals.css` — `--success`, `--color-success`; `src/modules/proposal/components/status-badge.tsx` — `APPROVED`; `src/modules/faucet/components/faucet-page.tsx` — completed step classes `border-success bg-success text-white`        |
| `--success-foreground` | `oklch(0.4 0.16 145)`      | `oklch(0.80 0.16 148)`   | Success/status text on pale semantic fills.                        | `src/app/globals.css` — `--success-foreground`, `--color-success-foreground`; `src/modules/milestone/components/milestone-status-badge.tsx` — `APPROVED`/`RELEASED` classes `text-success-foreground`                                           |

The proposal status mapping is `DRAFT → subtle`, `SUBMITTED → warning`,
`UNDER_REVIEW → info`, `APPROVED → success`, and `REJECTED → destructive`.
Source: `src/modules/proposal/components/status-badge.tsx` —
`proposalStatusBadgeVariants.status`.

The milestone mapping is `DRAFT/PENDING → subtle`, `VOTING → info`,
`RELEASING → warning`, `APPROVED/RELEASED → success`, and
`REJECTED/FAILED → destructive`. Source:
`src/modules/milestone/components/milestone-status-badge.tsx` —
`milestoneStatusBadgeVariants.status`.

### Chart and sidebar colors

| Family               | Values and behavior                                                                                                                                                   | Exact source                                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Charts               | `--chart-1` through `--chart-5` are a light-to-dark neutral ramp: `oklch(0.87 0 0)`, `0.556`, `0.439`, `0.371`, and `0.269`. The same values are used in both themes. | `src/app/globals.css` — `:root/.dark --chart-1` through `--chart-5`, `@theme --color-chart-*`                                                                                  |
| Sidebar surface      | `--sidebar` is light `oklch(0.985 0 0)`, dark `oklch(0.205 0 0)`; `--sidebar-foreground` is light `oklch(0.145 0 0)`, dark `oklch(0.985 0 0)`.                        | `src/app/globals.css` — `:root/.dark --sidebar`, `--sidebar-foreground`; `src/shared/components/shadcn-ui/sidebar.tsx` — `bg-sidebar text-sidebar-foreground`                  |
| Sidebar primary      | `--sidebar-primary` is light `oklch(0.205 0 0)`, dark violet-blue `oklch(0.488 0.243 264.376)`; `--sidebar-primary-foreground` is `oklch(0.985 0 0)` in both themes.  | `src/app/globals.css` — `:root/.dark --sidebar-primary`, `--sidebar-primary-foreground`                                                                                        |
| Sidebar active/hover | `--sidebar-accent` is light `oklch(0.97 0 0)`, dark `oklch(0.269 0 0)`; `--sidebar-accent-foreground` is light `oklch(0.205 0 0)`, dark `oklch(0.985 0 0)`.           | `src/app/globals.css` — `:root/.dark --sidebar-accent`, `--sidebar-accent-foreground`; `src/shared/components/shadcn-ui/sidebar.tsx` — `sidebarMenuButtonVariants`             |
| Sidebar border/ring  | `--sidebar-border` is light `oklch(0.922 0 0)`, dark `oklch(1 0 0 / 10%)`; `--sidebar-ring` is light `oklch(0.708 0 0)`, dark `oklch(0.556 0 0)`.                     | `src/app/globals.css` — `:root/.dark --sidebar-border`, `--sidebar-ring`; `src/shared/components/shadcn-ui/sidebar.tsx` — classes `ring-sidebar-ring`, `border-sidebar-border` |

### Theme and color application conventions

- Dark mode is opt-in through the `.dark` ancestor selector generated by
  `@custom-variant dark (&:is(.dark *))`. Source:
  `src/app/globals.css` — `@custom-variant dark`.
- The system usually relies on semantic utilities instead of manual color
  values. Source examples: `src/shared/components/shadcn-ui/button.tsx` —
  `buttonVariants`; `src/shared/components/shadcn-ui/card.tsx` — `Card`;
  `src/shared/components/shadcn-ui/input.tsx` — `Input`.
- Translucent background plus backdrop blur is used for sticky surfaces:
  `bg-background/80 backdrop-blur-sm` in
  `src/shared/components/sections/app-header.tsx` — `AppHeader`, and
  `bg-background/95` in `src/modules/faucet/components/faucet-page.tsx` —
  the public faucet header.
- Modal overlays use neutral black at low opacity:
  `bg-black/10 supports-backdrop-filter:backdrop-blur-xs`. Sources:
  `src/shared/components/shadcn-ui/dialog.tsx` — `DialogOverlay`;
  `src/shared/components/shadcn-ui/alert-dialog.tsx` — `AlertDialogOverlay`;
  `src/shared/components/shadcn-ui/sheet.tsx` — `SheetOverlay`.
- Toast colors are wired to semantic variables: normal popover colors, then
  `text-destructive`, `text-success`, `text-warning`, and `text-info` for
  status types. Source: `src/shared/components/shadcn-ui/sonner.tsx` —
  `Toaster.style` and `toastOptions.classNames`.

### Direct palette exceptions

These are implemented exceptions to the semantic-token convention.

| Exception                                                                                                                        | Exact source                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| KYC success banner uses `border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400`.                                | `src/modules/kyc/components/kyc-form.tsx` — `StatusBanner` success branch                                                                                                                              |
| Connected-wallet badge uses `bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-100`.                              | `src/modules/auth/components/register-form.tsx` — connected `Badge.className`                                                                                                                          |
| Admin proposal badges use raw blue, amber, and emerald scales instead of `info`, `warning`, and `success`.                       | `src/modules/admin/components/campaigns/admin-campaigns-table.tsx` — local `ProposalStatusBadge`, classes `border-blue-600/30`, `border-amber-600/30`, `border-emerald-600/30` and matching fills/text |
| Admin menu action icons use raw `text-emerald-600` and `text-red-600`.                                                           | `src/modules/admin/components/kyc/admin-kyc-table.tsx` — action `Check`, `X`, and `Prohibit` classes; `src/modules/admin/components/campaigns/admin-campaigns-table.tsx` — destructive `XIcon` class   |
| Proposal cards use raw neutral borders/rings for their media frame.                                                              | `src/modules/proposal/components/proposal-card.tsx` — classes `border-neutral-100 ring-neutral-100 dark:border-neutral-900/60 dark:ring-neutral-900/60`                                                |
| Tinted bubble surfaces use arbitrary relative OKLCH colors derived from `--primary`, rather than named semantic utilities.       | `src/shared/components/shadcn-ui/bubble.tsx` — `bubbleVariants.variant.tinted` classes `bg-[oklch(from_var(--primary)_...)]`                                                                           |
| Native select options inherit operating-system canvas colors.                                                                    | `src/shared/components/shadcn-ui/native-select.tsx` — `NativeSelectOption` and `NativeSelectOptGroup` classes `bg-[Canvas] text-[CanvasText]`                                                          |
| The app container contains `bg-red-10`, which is not backed by a declared project token and is not a standard Tailwind red step. | `src/shared/components/layouts/app-container.tsx` — `AppContainer` class `bg-red-10`                                                                                                                   |
| Slider thumbs use literal `bg-white`, while completed faucet steps use literal `text-white`.                                     | `src/shared/components/shadcn-ui/slider.tsx` — `SliderPrimitive.Thumb`; `src/modules/faucet/components/faucet-page.tsx` — `FlowStep` completed classes                                                 |

## 2. Typography

### Font families

| Role             | Family            | Implementation                                                                                                               | Exact source                                                                                                                                                                                                                                                   |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sans/body        | Plus Jakarta Sans | Loaded with `next/font/google`, exposed as `--font-sans`, applied to `<html>` and again in the base layer.                   | `src/app/layout.tsx` — `fontSans = Plus_Jakarta_Sans`, root classes `fontSans.variable`, `font-sans`; `src/app/globals.css` — `@theme --font-sans`, `html { @apply font-sans }`                                                                                |
| Headings/display | Plus Jakarta Sans | A separate font instance exposes `--font-heading`; cards, dialogs, drawer titles, and marketing headings use `font-heading`. | `src/app/layout.tsx` — `fontHeading = Plus_Jakarta_Sans`; `src/app/globals.css` — `@theme --font-heading`; `src/shared/components/shadcn-ui/card.tsx` — `CardTitle` class `font-heading`                                                                       |
| Monospace/data   | Geist Mono        | Loaded as `--font-mono`; used for addresses, transaction hashes, balances, and numeric chart values.                         | `src/app/layout.tsx` — `fontMono = Geist_Mono`, root class `fontMono.variable`; `src/modules/auth/components/register-form.tsx` — wallet address class `font-mono`; `src/shared/components/shadcn-ui/chart.tsx` — tooltip value class `font-mono tabular-nums` |

Both the body and heading roles currently resolve to Plus Jakarta Sans. Source:
`src/app/layout.tsx` — `fontHeading` and `fontSans`.

### Type scale

The standard Tailwind scale comes from
`node_modules/tailwindcss/theme.css` (`--text-*`) and is pinned by
`package.json` (`tailwindcss: ^4.3.2`).

| Class             | Size              | Default line height | Project evidence                                                                                                                                          |
| ----------------- | ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text-xs`         | `0.75rem` / 12px  | `1rem` / 16px       | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants`; this is the dominant control and metadata size                                           |
| `text-sm`         | `0.875rem` / 14px | `1.25rem` / 20px    | `src/shared/components/primitives/typography/text.tsx` — `body-small`, `caption`, and `label`                                                             |
| `text-base`       | `1rem` / 16px     | `1.5rem` / 24px     | `src/shared/components/primitives/typography/text.tsx` — `body`; `src/shared/components/primitives/typography/heading.tsx` — `H6`                         |
| `text-lg`         | `1.125rem` / 18px | `1.75rem` / 28px    | `src/shared/components/primitives/typography/text.tsx` — `body-large`; `src/shared/components/primitives/typography/heading.tsx` — `H5`                   |
| `text-xl`         | `1.25rem` / 20px  | `1.75rem` / 28px    | `src/shared/components/primitives/typography/heading.tsx` — `H4`                                                                                          |
| `text-2xl`        | `1.5rem` / 24px   | `2rem` / 32px       | `src/shared/components/primitives/typography/heading.tsx` — `H3`; `src/app/(public)/page.tsx` — hero metric                                               |
| `text-3xl`        | `1.875rem` / 30px | `2.25rem` / 36px    | `src/shared/components/primitives/typography/heading.tsx` — `H2`; `src/app/(public)/page.tsx` — section headings                                          |
| `text-4xl`        | `2.25rem` / 36px  | `2.5rem` / 40px     | `src/shared/components/primitives/typography/heading.tsx` — `H1`; `src/app/(public)/page.tsx` — mobile hero heading                                       |
| `text-5xl`        | `3rem` / 48px     | `1`                 | `src/app/(public)/page.tsx` — hero class `sm:text-5xl`; `src/modules/faucet/components/faucet-page.tsx` — `sm:text-5xl`                                   |
| `text-6xl`        | `3.75rem` / 60px  | `1`                 | `src/app/(public)/page.tsx` — hero class `lg:text-6xl`                                                                                                    |
| `text-[10px]`     | 10px              | inherited           | `src/modules/admin/components/kyc/admin-kyc-table.tsx` — role badge; `src/app/entrepreneur/[campaignId]/_components/header-sidebar.tsx` — proposal status |
| `text-[0.625rem]` | 10px              | inherited           | `src/shared/components/sections/user-popover.tsx` — `KYCBadge`                                                                                            |
| `text-[0.8rem]`   | 12.8px            | inherited           | `src/shared/components/shadcn-ui/calendar.tsx` — weekday/week number labels                                                                               |

### Heading primitives

| Primitive | Classes                                                 | Resolved convention                                     | Exact source                                                     |
| --------- | ------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `H1`      | `text-4xl leading-[1.1] font-extrabold tracking-tight`  | 36px, weight 800, 1.1 line height, `-0.025em` tracking. | `src/shared/components/primitives/typography/heading.tsx` — `H1` |
| `H2`      | `text-3xl leading-[1.15] font-extrabold tracking-tight` | 30px, weight 800, 1.15 line height.                     | `src/shared/components/primitives/typography/heading.tsx` — `H2` |
| `H3`      | `text-2xl leading-tight font-bold`                      | 24px, weight 700, 1.25 line height.                     | `src/shared/components/primitives/typography/heading.tsx` — `H3` |
| `H4`      | `text-xl leading-snug font-bold`                        | 20px, weight 700, 1.375 line height.                    | `src/shared/components/primitives/typography/heading.tsx` — `H4` |
| `H5`      | `text-lg leading-snug font-semibold`                    | 18px, weight 600, 1.375 line height.                    | `src/shared/components/primitives/typography/heading.tsx` — `H5` |
| `H6`      | `text-base leading-snug font-semibold`                  | 16px, weight 600, 1.375 line height.                    | `src/shared/components/primitives/typography/heading.tsx` — `H6` |

Tailwind weight values are 400 (`font-normal`), 500 (`font-medium`), 600
(`font-semibold`), 700 (`font-bold`), and 800 (`font-extrabold`). Dependency
source: `node_modules/tailwindcss/theme.css` — `--font-weight-*`. Project usage
source: `src/shared/components/primitives/typography/heading.tsx` and
`src/shared/components/primitives/typography/text.tsx`.

### Body and utility text

`Text` uses CVA and defaults to the `body` variant:

| Variant       | Classes                                        | Exact source                                                                                |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `body-large`  | `text-lg`                                      | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.body-large`  |
| `body`        | `text-base`                                    | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.body`        |
| `body-small`  | `text-sm`                                      | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.body-small`  |
| `caption`     | `text-sm text-muted-foreground`                | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.caption`     |
| `caption-sm`  | `text-xs text-muted-foreground`                | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.caption-sm`  |
| `label`       | `text-sm font-medium`                          | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.label`       |
| `label-small` | `text-xs font-medium`                          | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.label-small` |
| `overline`    | `text-xs font-medium tracking-wider uppercase` | `src/shared/components/primitives/typography/text.tsx` — `textVariants.variant.overline`    |

The primitive balances text, switches to `text-pretty` from `md`, underlines
links, and increases linked text to medium weight on hover. Source:
`src/shared/components/primitives/typography/text.tsx` — `textVariants` base
classes `text-balance md:text-pretty [&_a]:underline
[&_a]:hover:font-medium`.

The base string also contains `leading-`, which is not a complete Tailwind
utility and therefore does not establish a line height. Source:
`src/shared/components/primitives/typography/text.tsx` — `textVariants` base
class `leading-`.

Explicit content line heights in feature views include `leading-4` (16px),
`leading-5` (20px), `leading-6` (24px), and `leading-7` (28px). Sources:
`src/app/(public)/register/page.tsx` — numbered benefit marker `leading-4`;
`src/app/(public)/page.tsx` — helper text `leading-5`, feature copy
`leading-6`, hero copy `leading-7`.

## 3. Spacing scale

Tailwind defines `--spacing: 0.25rem` (4px), so numeric spacing utilities are
multiples of 4px. Dependency source:
`node_modules/tailwindcss/theme.css` — `--spacing`. The following scale values
are present in padding, margin, gap, or space utilities in the project.

| Step  | Rem / px          | Representative implemented class and exact source                                                                                                                                                  |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`   | 0                 | `src/shared/components/shadcn-ui/sidebar.tsx` — mobile sheet `p-0`; `src/shared/components/shadcn-ui/combobox.tsx` — `data-empty:p-0`                                                              |
| `px`  | 1px               | `src/shared/components/shadcn-ui/sidebar.tsx` — `SidebarMenuSub` class `translate-x-px`; `src/shared/components/shadcn-ui/scroll-area.tsx` — `p-px`                                                |
| `0.5` | `0.125rem` / 2px  | `src/shared/components/sections/sidebar/app-sidebar.tsx` — logo and menu `gap-0.5`                                                                                                                 |
| `1`   | `0.25rem` / 4px   | `src/modules/milestone/components/milestone-vote-card.tsx` — stat stack `gap-1`                                                                                                                    |
| `1.5` | `0.375rem` / 6px  | `src/shared/assets/stacked-card.tsx` — front-card copy `gap-1.5`                                                                                                                                   |
| `2`   | `0.5rem` / 8px    | `src/shared/components/shadcn-ui/field.tsx` — `fieldVariants` base `gap-2`; `src/shared/components/shadcn-ui/table.tsx` — cells `p-2`                                                              |
| `2.5` | `0.625rem` / 10px | `src/shared/components/shadcn-ui/input.tsx` — `px-2.5`; `src/shared/components/sections/sidebar/app-sidebar.tsx` — header `px-2.5`                                                                 |
| `3`   | `0.75rem` / 12px  | `src/shared/assets/stacked-card.tsx` — `gap-3`; `src/shared/components/shadcn-ui/card.tsx` — small-card `--spacing(3)`                                                                             |
| `3.5` | `0.875rem` / 14px | `src/modules/holdings/components/holdings-skeleton.tsx` — row `py-3.5`; `src/shared/components/shadcn-ui/sidebar.tsx` — action `top-3.5`                                                           |
| `4`   | `1rem` / 16px     | `src/shared/components/layouts/app-container.tsx` — `p-4`; `src/shared/components/shadcn-ui/dialog.tsx` — content `gap-4 p-4`; `src/shared/components/shadcn-ui/card.tsx` — default `--spacing(4)` |
| `5`   | `1.25rem` / 20px  | `src/shared/components/shadcn-ui/field.tsx` — `FieldGroup` class `gap-5`; `src/modules/milestone/components/milestone-card.tsx` — content `p-5`                                                    |
| `6`   | `1.5rem` / 24px   | `src/shared/components/layouts/app-container.tsx` — `md:p-6`; `src/modules/investment/components/investor-campaign-details.tsx` — page stack `gap-6`                                               |
| `7`   | `1.75rem` / 28px  | `src/shared/components/shadcn-ui/dropdown-menu.tsx` — inset item `pl-7`                                                                                                                            |
| `8`   | `2rem` / 32px     | `src/modules/kyc/components/kyc-form.tsx` — icon-leading input `pl-8`; `src/modules/proposal/pages/create-proposal.tsx` — page `gap-8`                                                             |
| `10`  | `2.5rem` / 40px   | `src/app/(public)/page.tsx` — hero and workflow `gap-10`; `src/app/(public)/kyc/page.tsx` — `sm:p-10`                                                                                              |
| `12`  | `3rem` / 48px     | `src/app/(public)/register/page.tsx` — main `py-12`                                                                                                                                                |
| `14`  | `3.5rem` / 56px   | `src/app/(public)/page.tsx` — hero `py-14`                                                                                                                                                         |
| `16`  | `4rem` / 64px     | `src/app/(public)/page.tsx` — section `py-16`; `src/modules/proposal/pages/create-proposal.tsx` — `pb-16`                                                                                          |
| `18`  | `4.5rem` / 72px   | `src/shared/components/shadcn-ui/alert.tsx` — alert-with-action `pr-18`                                                                                                                            |
| `20`  | `5rem` / 80px     | `src/app/(public)/page.tsx` — responsive section `sm:py-20`                                                                                                                                        |
| `24`  | `6rem` / 96px     | `src/shared/components/shadcn-ui/drawer.tsx` — top/bottom drawer offset `mt-24` / `mb-24`                                                                                                          |
| `28`  | `7rem` / 112px    | `src/shared/components/shadcn-ui/menubar.tsx` — shortcut-bearing item `pr-28`                                                                                                                      |

### Spacing conventions

- Feature stacks normally use `flex flex-col gap-*`; common local gaps are
  8px (`gap-2`), 12px (`gap-3`), 16px (`gap-4`), 20px (`gap-5`), and 24px
  (`gap-6`). Source examples:
  `src/modules/investment/components/investor-campaign-details.tsx` —
  `gap-2`, `gap-4`, `gap-5`, and `gap-6`.
- `FieldGroup` separates fields by 20px (`gap-5`), individual field parts by
  8px (`gap-2`), and descriptions/content by 2px (`gap-0.5`). Source:
  `src/shared/components/shadcn-ui/field.tsx` — `FieldGroup`,
  `fieldVariants`, and `FieldContent`.
- Default card padding and internal gap are controlled through
  `[--card-spacing:--spacing(4)]` (16px); small cards use
  `data-[size=sm]:[--card-spacing:--spacing(3)]` (12px). Source:
  `src/shared/components/shadcn-ui/card.tsx` — `Card`.
- Default controls are compact: 32px high with 10px horizontal padding.
  Source: `src/shared/components/shadcn-ui/button.tsx` —
  `buttonVariants.size.default` (`h-8 px-2.5`), and
  `src/shared/components/shadcn-ui/input.tsx` — `h-8 px-2.5`.
- The main portal content gutter is 16px on mobile and 24px from `md`.
  Source: `src/shared/components/layouts/app-container.tsx` —
  `p-4 md:p-6`.
- Public-page horizontal gutters follow 16px → 24px → 32px at
  `base`/`sm`/`lg`. Source: `src/app/(public)/page.tsx` — repeated
  `px-4 sm:px-6 lg:px-8`.
- Some existing layout code uses `space-y-*` instead of `gap-*`, notably
  `space-y-4` in `src/shared/components/layouts/app-container.tsx` —
  `AppContainer`, and `space-y-6` in
  `src/modules/milestone/components/submit-disbursement-dialog.tsx` — form
  class.
- Arbitrary micro-spacing exists in grouped controls:
  `ml-[-0.3rem]`/`mr-[-0.3rem]` and
  `ml-[-0.15rem]`/`mr-[-0.15rem]`. Source:
  `src/shared/components/shadcn-ui/input-group.tsx` —
  `inputGroupAddonVariants`.
- Tabs and menubars add sub-step padding: `p-[3px]`,
  `py-[calc(--spacing(0.8))]` (3.2px), and
  `py-[calc(--spacing(1.25))]` (5px). Sources:
  `src/shared/components/shadcn-ui/tabs.tsx` — `tabsListVariants` and
  `TabsTrigger`; `src/shared/components/shadcn-ui/menubar.tsx` —
  `MenubarTrigger`.

## 4. Border radii, borders, and shadows

### Radius tokens

The base radius is 10px, but the project’s dominant component convention is
explicitly square.

| Token          | Formula          | Resolved value    | Exact source                                  |
| -------------- | ---------------- | ----------------- | --------------------------------------------- |
| `--radius`     | literal          | `0.625rem` / 10px | `src/app/globals.css` — `:root --radius`      |
| `--radius-sm`  | `--radius × 0.6` | `0.375rem` / 6px  | `src/app/globals.css` — `@theme --radius-sm`  |
| `--radius-md`  | `--radius × 0.8` | `0.5rem` / 8px    | `src/app/globals.css` — `@theme --radius-md`  |
| `--radius-lg`  | `--radius`       | `0.625rem` / 10px | `src/app/globals.css` — `@theme --radius-lg`  |
| `--radius-xl`  | `--radius × 1.4` | `0.875rem` / 14px | `src/app/globals.css` — `@theme --radius-xl`  |
| `--radius-2xl` | `--radius × 1.8` | `1.125rem` / 18px | `src/app/globals.css` — `@theme --radius-2xl` |
| `--radius-3xl` | `--radius × 2.2` | `1.375rem` / 22px | `src/app/globals.css` — `@theme --radius-3xl` |
| `--radius-4xl` | `--radius × 2.6` | `1.625rem` / 26px | `src/app/globals.css` — `@theme --radius-4xl` |

`rounded-none` is explicitly set on buttons, inputs, textareas, selects, cards,
dialogs, sheets, drawers, popovers, menus, tabs, badges, alerts, tooltips, and
sidebar items. Representative sources:
`src/shared/components/shadcn-ui/button.tsx` — `buttonVariants`;
`src/shared/components/shadcn-ui/card.tsx` — `Card`;
`src/shared/components/shadcn-ui/dialog.tsx` — `DialogContent`;
`src/shared/components/shadcn-ui/input.tsx` — `Input`.

Round shapes are reserved for controls or indicators whose shape carries
meaning:

- Avatars use `rounded-full`. Source:
  `src/shared/components/shadcn-ui/avatar.tsx` — `Avatar`, `AvatarImage`,
  `AvatarFallback`.
- Radio controls and their inner indicator use `rounded-full`. Source:
  `src/shared/components/shadcn-ui/radio-group.tsx` — `RadioGroupItem` and
  indicator `span`.
- Switch track and thumb use `rounded-full`. Source:
  `src/shared/components/shadcn-ui/switch.tsx` — `SwitchPrimitive.Root` and
  `SwitchPrimitive.Thumb`.
- Live-status pulse dots use `rounded-full`. Source:
  `src/modules/proposal/components/status-badge.tsx` —
  `pulseDotVariants`.
- Progress bars use `rounded-full` in the holdings feature. Source:
  `src/modules/holdings/components/holdings-table.tsx` — ownership bar
  container and fill.

Implemented feature exceptions include `rounded-md` around dashboard tables
(`src/modules/investor-dashboard/components/holdings-list.tsx` and
`src/modules/investor-dashboard/components/investment-history.tsx`) and
`rounded-sm` around campaign switcher thumbnails
(`src/modules/proposal/components/proposal-switcher-popover.tsx`).

### Borders and focus rings

| Convention                                                                                                                   | Exact source                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The base layer assigns `border-border` and `outline-ring/50` to every element.                                               | `src/app/globals.css` — `@layer base *`                                                                                                                                                                                                                 |
| Standard controls use a 1px `border border-input`; focus changes the border to `border-ring` and adds `ring-1 ring-ring/50`. | `src/shared/components/shadcn-ui/input.tsx` — `Input`; `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants`                                                                                                                                  |
| Checkbox and switch focus rings are 1px; radio groups use a stronger `ring-3`.                                               | `src/shared/components/shadcn-ui/checkbox.tsx` — `focus-visible:ring-1`; `src/shared/components/shadcn-ui/switch.tsx` — `focus-visible:ring-1`; `src/shared/components/shadcn-ui/radio-group.tsx` — `focus-visible:ring-3`                              |
| Tabs, toggles, badges, scroll areas, and items use 3px focus rings.                                                          | `src/shared/components/shadcn-ui/tabs.tsx` — `TabsTrigger`; `src/shared/components/shadcn-ui/toggle.tsx` — `toggleVariants`; `src/shared/components/shadcn-ui/badge.tsx` — `badgeVariants`; `src/shared/components/shadcn-ui/item.tsx` — `itemVariants` |
| Cards have no border by default; they use `ring-1 ring-foreground/10` to define the edge.                                    | `src/shared/components/shadcn-ui/card.tsx` — `Card`                                                                                                                                                                                                     |
| Dialogs and floating menu surfaces also use `ring-1 ring-foreground/10`.                                                     | `src/shared/components/shadcn-ui/dialog.tsx` — `DialogContent`; `src/shared/components/shadcn-ui/select.tsx` — `SelectContent`; `src/shared/components/shadcn-ui/popover.tsx` — `PopoverContent`                                                        |
| Status components use translucent semantic borders, generally `/30`–`/50`, over `/5`–`/10` fills.                            | `src/modules/proposal/components/status-badge.tsx` — `proposalStatusBadgeVariants.status`; `src/modules/kyc/components/kyc-status-alert.tsx` — `ALERT_CONFIG.wrapperClass`                                                                              |
| Table structure uses row separators (`border-b`) and a footer separator (`border-t`); the last body row removes its border.  | `src/shared/components/shadcn-ui/table.tsx` — `TableHeader`, `TableBody`, `TableFooter`, `TableRow`                                                                                                                                                     |
| Dashed borders represent idle upload/drop areas or empty proof states.                                                       | `src/modules/kyc/components/webcam-capture.tsx` — capture control `border-dashed`; `src/modules/milestone/components/milestone-proof-card.tsx` — empty state `border-dashed`                                                                            |

### Shadows

Tailwind shadow values come from `node_modules/tailwindcss/theme.css` —
`--shadow-*`.

| Level              | Resolved dependency value                                           | Implemented use and exact source                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadow-xs`        | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                     | Hover elevation for proposal and milestone cards: `src/modules/proposal/components/proposal-card.tsx` — `hover:shadow-xs`; `src/modules/milestone/components/milestone-card.tsx` — `hover:shadow-xs`                                                                                                                                                  |
| `shadow-sm`        | `0 1px 3px rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)`         | Static detail surfaces and floating/inset sidebar: `src/modules/milestone/components/milestone-detail-header.tsx` — `shadow-sm`; `src/shared/components/shadcn-ui/sidebar.tsx` — floating inner/sidebar inset                                                                                                                                         |
| `shadow-md`        | `0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)`    | Popovers, selects, comboboxes, and standard menu surfaces. Sources: `src/shared/components/shadcn-ui/popover.tsx` — `PopoverContent`; `src/shared/components/shadcn-ui/select.tsx` — `SelectContent`; `src/shared/components/shadcn-ui/combobox.tsx` — `ComboboxContent`; `src/shared/components/shadcn-ui/dropdown-menu.tsx` — `DropdownMenuContent` |
| `shadow-lg`        | `0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)`  | Sheets and nested menus. Sources: `src/shared/components/shadcn-ui/sheet.tsx` — `SheetContent`; `src/shared/components/shadcn-ui/dropdown-menu.tsx` — `DropdownMenuSubContent`                                                                                                                                                                        |
| `shadow-xl`        | `0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1)` | Chart tooltips: `src/shared/components/shadcn-ui/chart.tsx` — tooltip wrapper `shadow-xl`                                                                                                                                                                                                                                                             |
| Custom 1px outline | `0 0 0 1px var(--sidebar-border)`                                   | Outline sidebar menu variant, with accent outline on hover.                                                                                                                                                                                                                                                                                           | `src/shared/components/shadcn-ui/sidebar.tsx` — `sidebarMenuButtonVariants.variant.outline` |

## 5. Breakpoints and responsive behavior

### Breakpoint scale

| Prefix | Minimum width    | Project behavior                                                                                                             | Exact source                                                                                                                                                                                                                                                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sm`   | `40rem` / 640px  | Forms/actions switch from stacked to rows; two- and three-column grids appear; public gutters increase to 24px.              | Dependency: `node_modules/tailwindcss/theme.css` — `--breakpoint-sm`; project: `src/modules/proposal/components/forms/create-proposal.tsx` — `sm:flex-row`; `src/app/(public)/page.tsx` — `sm:px-6`                                                                                                            |
| `md`   | `48rem` / 768px  | Portal sidebar changes from mobile sheet to desktop rail; header title appears; common dashboards become 2–3 columns.        | Dependency: `--breakpoint-md`; project: `src/shared/hooks/use-mobile.ts` — `MOBILE_BREAKPOINT = 768`; `src/shared/components/shadcn-ui/sidebar.tsx` — `md:block`/`md:flex`; `src/shared/components/sections/app-header.tsx` — `hidden md:inline`                                                               |
| `lg`   | `64rem` / 1024px | Marketing page becomes split-grid, public gutters reach 32px, wider table columns appear, and registration artwork is shown. | Dependency: `--breakpoint-lg`; project: `src/app/(public)/page.tsx` — `lg:grid-cols-[1fr_0.9fr] lg:px-8`; `src/app/(public)/register/page.tsx` — `lg:flex`; `src/modules/holdings/components/holdings-table.tsx` — `lg:table-cell`                                                                             |
| `xl`   | `80rem` / 1280px | Three/four-column discovery grids and sticky detail sidebars; portal content is capped at `max-w-7xl`.                       | Dependency: `--breakpoint-xl`; project: `src/modules/campaign/components/campaign-discovery.tsx` — `xl:grid-cols-3`; `src/modules/investment/components/investor-campaign-details.tsx` — `xl:grid-cols-[minmax(0,1fr)_24rem]`, `xl:sticky`; `src/shared/components/layouts/app-container.tsx` — `xl:max-w-7xl` |
| `2xl`  | `96rem` / 1536px | Available from Tailwind; no dedicated project layout convention is defined around it.                                        | Dependency: `node_modules/tailwindcss/theme.css` — `--breakpoint-2xl`; repository theme does not override this token                                                                                                                                                                                           |

### Responsive conventions

- The mobile hook treats widths below 768px as mobile using
  `matchMedia("(max-width: 767px)")`. Source:
  `src/shared/hooks/use-mobile.ts` — `MOBILE_BREAKPOINT` and `useIsMobile`.
- On mobile, the portal sidebar is an 18rem sheet; on desktop it is a 16rem
  fixed sidebar that collapses to a 3rem icon rail. Source:
  `src/shared/components/shadcn-ui/sidebar.tsx` —
  `SIDEBAR_WIDTH_MOBILE`, `SIDEBAR_WIDTH`, `SIDEBAR_WIDTH_ICON`, and
  `Sidebar`.
- The sidebar is rendered as a `Sheet` below `md`, hidden as a desktop
  structure until `md`, and uses `collapsible="icon"` in portal composition.
  Source: `src/shared/components/shadcn-ui/sidebar.tsx` — `isMobile` branch
  and desktop `md:block`; `src/shared/components/sections/sidebar/app-sidebar.tsx`
  — `<Sidebar collapsible="icon">`.
- The sticky portal header is always 64px high. Desktop shows the title or
  breadcrumb, while mobile shows the sidebar menu trigger. Source:
  `src/shared/components/sections/app-header.tsx` — `h-16`,
  `hidden md:inline`, and trigger `md:hidden`.
- Dialog content is full-width minus 32px on small screens and caps at
  `max-w-sm` from `sm`. Source:
  `src/shared/components/shadcn-ui/dialog.tsx` — `DialogContent` classes
  `max-w-[calc(100%-2rem)] sm:max-w-sm`.
- Dialog footers stack in reverse order on mobile and align actions to the end
  in a row from `sm`. Source:
  `src/shared/components/shadcn-ui/dialog.tsx` — `DialogFooter` classes
  `flex-col-reverse sm:flex-row sm:justify-end`.
- Sheets use 75% width from the left or right and cap at `max-w-sm` from
  `sm`. Source: `src/shared/components/shadcn-ui/sheet.tsx` —
  `SheetContent`.
- Tables are always wrapped in `overflow-x-auto`; selected feature tables also
  hide secondary columns at `md` and `lg`. Source:
  `src/shared/components/shadcn-ui/table.tsx` — `Table` container;
  `src/modules/holdings/components/holdings-table.tsx` —
  `hidden md:table-cell`, `hidden lg:table-cell`.
- Public marketing sections use mobile-first single columns, commonly becoming
  two columns at `lg`; workflow cards move through 1 → 2 → 4 columns at
  base/`md`/`xl`. Source: `src/app/(public)/page.tsx` —
  `lg:grid-cols-2` and `md:grid-cols-2 xl:grid-cols-4`.
- Sonner notifications appear at `top-center` on mobile and `bottom-right`
  otherwise. Source: `src/shared/components/shadcn-ui/sonner.tsx` —
  `position={isMobile ? "top-center" : "bottom-right"}`.
- `Field` has a container-responsive orientation that switches at the field
  group’s `@md` container rather than the viewport. Source:
  `src/shared/components/shadcn-ui/field.tsx` — `FieldGroup` class
  `@container/field-group` and `fieldVariants.orientation.responsive`.

## 6. Component variants and states

### Buttons

`Button` uses CVA with seven visual variants and eight sizes.

| Variant       | Appearance                                                                                                 | Exact source                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `default`     | Solid primary; foreground contrast; primary fades to 80% on hover.                                         | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.default`     |
| `outline`     | Border/background control; muted hover; expanded state stays muted; dark mode uses translucent input fill. | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.outline`     |
| `secondary`   | Secondary fill; hover is a 5% foreground color mix.                                                        | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.secondary`   |
| `ghost`       | Transparent until muted hover or expanded state.                                                           | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.ghost`       |
| `destructive` | Pale destructive fill with destructive text and destructive focus ring.                                    | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.destructive` |
| `link`        | Primary text; underline only on hover.                                                                     | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.link`        |
| `input`       | Input-like 32px bordered button with transparent/translucent fill.                                         | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.variant.input`       |

Sizes are `default` (`h-8`), `xs` (`h-6`), `sm` (`h-7`), `lg` (`h-9`),
and matching icon-only `icon`, `icon-xs`, `icon-sm`, `icon-lg`. Source:
`src/shared/components/shadcn-ui/button.tsx` — `buttonVariants.size`.

All buttons are square, `text-xs font-medium`, prevent wrapping, default icons
to 16px, and use `data-icon` selectors to tighten leading/trailing padding.
Source: `src/shared/components/shadcn-ui/button.tsx` —
`buttonVariants` base and size classes.

Button states are:

- hover color/fill per variant;
- keyboard focus through `focus-visible:border-ring` and a 1px half-opacity
  ring;
- a 1px downward press for non-popup buttons with
  `active:not-aria-[haspopup]:translate-y-px`;
- `pointer-events-none opacity-50` when disabled;
- destructive border/ring when `aria-invalid`.

Source: `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants` base.

### Badges and domain status

Base badge variants are `default`, `secondary`, `destructive`, `outline`,
`ghost`, and `link`, with `xs`, `default`, `md`, and `lg` sizes. Source:
`src/shared/components/shadcn-ui/badge.tsx` — `badgeVariants.variant` and
`badgeVariants.size`.

Domain badges override the base badge color system with border-led semantic
status variants and default to the 24px `md` size. Source:
`src/modules/proposal/components/status-badge.tsx` —
`proposalStatusBadgeVariants`; and
`src/modules/milestone/components/milestone-status-badge.tsx` —
`milestoneStatusBadgeVariants`.

Approved proposals add a pulsing semantic dot. Source:
`src/modules/proposal/components/status-badge.tsx` —
`status === "APPROVED"` and class `animate-ping`.

### Other primitive variants

| Component                 | Variants/states                                                                                                                               | Exact source                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Alert`                   | `default` card treatment and `destructive` error treatment; always `role="alert"`.                                                            | `src/shared/components/shadcn-ui/alert.tsx` — `alertVariants` and `Alert`                                                                                           |
| `Toggle`                  | `default` transparent or `outline`; sizes `default`, `sm`, `lg`; `aria-pressed` / `data-[state=on]` use muted fill.                           | `src/shared/components/shadcn-ui/toggle.tsx` — `toggleVariants`                                                                                                     |
| `ToggleGroup`             | Horizontal or vertical, inherited toggle variant/size, configurable numeric spacing; zero spacing joins borders.                              | `src/shared/components/shadcn-ui/toggle-group.tsx` — `ToggleGroupContext`, `ToggleGroup`, `ToggleGroupItem`                                                         |
| `TabsList`                | `default` muted filled list or `line` transparent list.                                                                                       | `src/shared/components/shadcn-ui/tabs.tsx` — `tabsListVariants`                                                                                                     |
| `TabsTrigger`             | Active filled state for default tabs; active 2px underline/side rule for line tabs; supports horizontal and vertical orientation.             | `src/shared/components/shadcn-ui/tabs.tsx` — `TabsTrigger` classes `data-active:*`, `after:*`, `group-data-[variant=line]`                                          |
| `Item`                    | `default`, `outline`, or `muted`; sizes `default`, `sm`, `xs`; optional media variants `default`, `icon`, `image`.                            | `src/shared/components/shadcn-ui/item.tsx` — `itemVariants`, `itemMediaVariants`                                                                                    |
| `Field`                   | `vertical`, `horizontal`, or container-responsive orientation; invalid state switches field text to destructive.                              | `src/shared/components/shadcn-ui/field.tsx` — `fieldVariants`                                                                                                       |
| `Sidebar`                 | Side `left`/`right`; surface `sidebar`/`floating`/`inset`; collapse `offcanvas`/`icon`/`none`; state `expanded`/`collapsed`.                  | `src/shared/components/shadcn-ui/sidebar.tsx` — `Sidebar` props and `SidebarContextProps`                                                                           |
| `SidebarMenuButton`       | `default` or outlined; `default`, `sm`, `lg` sizes; active, open, hover, focus, disabled, and collapsed-icon states.                          | `src/shared/components/shadcn-ui/sidebar.tsx` — `sidebarMenuButtonVariants`                                                                                         |
| `Switch`                  | `default` 32×18.4px or `sm` 24×14px; checked/unchecked, invalid, focused, disabled.                                                           | `src/shared/components/shadcn-ui/switch.tsx` — `Switch`                                                                                                             |
| `Select` / `NativeSelect` | `default` 32px or `sm` 28px; placeholder, focused, invalid, disabled, open, selected item states.                                             | `src/shared/components/shadcn-ui/select.tsx` — `SelectTrigger`, `SelectContent`, `SelectItem`; `src/shared/components/shadcn-ui/native-select.tsx` — `NativeSelect` |
| `Card`                    | `default` 16px internal spacing or `sm` 12px internal spacing.                                                                                | `src/shared/components/shadcn-ui/card.tsx` — `Card` `size` and `data-[size=sm]`                                                                                     |
| `AlertDialog`             | `default` or `sm` content layout; open/closed overlay and content states.                                                                     | `src/shared/components/shadcn-ui/alert-dialog.tsx` — `AlertDialogContent`, `data-[size=*]`                                                                          |
| `Attachment`              | Sizes `default`/`sm`/`xs`; horizontal/vertical orientation; states `idle`, `uploading`, `processing`, `error`, `done`; media `icon`/`image`.  | `src/shared/components/shadcn-ui/attachment.tsx` — `attachmentVariants`, `attachmentMediaVariants`, `Attachment.state`                                              |
| `Bubble`                  | `default`, `secondary`, `muted`, `tinted`, `outline`, `ghost`, `destructive`; start/end alignment and interactive hover/focus states.         | `src/shared/components/shadcn-ui/bubble.tsx` — `bubbleVariants`, `BubbleContent`                                                                                    |
| `ButtonGroup`             | Horizontal/vertical orientation joins adjacent borders and raises focused children above neighbors.                                           | `src/shared/components/shadcn-ui/button-group.tsx` — `buttonGroupVariants`                                                                                          |
| `EmptyMedia`              | Transparent `default` or 32px muted `icon` presentation.                                                                                      | `src/shared/components/shadcn-ui/empty.tsx` — `emptyMediaVariants`                                                                                                  |
| `InputGroup`              | Add-ons align `inline-start`, `inline-end`, `block-start`, or `block-end`; nested buttons use `xs`, `sm`, `icon-xs`, or `icon-sm`.            | `src/shared/components/shadcn-ui/input-group.tsx` — `inputGroupAddonVariants`, `inputGroupButtonVariants`                                                           |
| `Marker`                  | `default`, centered `separator`, or bottom `border` treatment.                                                                                | `src/shared/components/shadcn-ui/marker.tsx` — `markerVariants`                                                                                                     |
| `NavigationMenu`          | Trigger supports hover, focus, disabled, open, and popup-open states; content supports directional motion and viewport/non-viewport surfaces. | `src/shared/components/shadcn-ui/navigation-menu.tsx` — `navigationMenuTriggerStyle`, `NavigationMenuContent`, `NavigationMenuViewport`                             |

## 7. Component conventions

### Forms

- Form state is handled with React Hook Form and Zod through the project
  `useHookForm` wrapper. Source: `src/shared/lib/hook-form.ts` —
  `useHookForm`, `zodResolver(schema)`.
- Fields are composed as `FieldGroup → Field → FieldLabel → control →
FieldError/FieldDescription`. Source:
  `src/modules/kyc/components/kyc-form.tsx` — `KycForm`; and
  `src/modules/proposal/components/forms/create-proposal.tsx` —
  `CreateProposalForm`.
- Labels are 12px and use `htmlFor`/matching control `id`. Source:
  `src/shared/components/shadcn-ui/label.tsx` — `Label` class
  `text-xs leading-none`; `src/modules/kyc/components/kyc-form.tsx` —
  `FieldLabel htmlFor="fullName"` and `Input id="fullName"`.
- Required markers are destructive-colored asterisks hidden from assistive
  technology. Source: `src/modules/kyc/components/kyc-form.tsx` —
  `<span className="text-destructive" aria-hidden>*</span>`.
- Validation uses `data-invalid` on `Field`, `aria-invalid` on the control,
  and destructive `FieldError`. Source:
  `src/modules/proposal/components/forms/create-proposal.tsx` —
  business-name field; `src/shared/components/shadcn-ui/field.tsx` —
  `fieldVariants` and `FieldError`.
- Inputs are 32px high, 12px text, square, transparent in light mode, and use
  a 30% input fill in dark mode. Source:
  `src/shared/components/shadcn-ui/input.tsx` — `Input` classes `h-8
text-xs rounded-none bg-transparent dark:bg-input/30`.
- Textareas keep the same visual treatment, use `min-h-16`, and grow with
  content through `field-sizing-content`. Source:
  `src/shared/components/shadcn-ui/textarea.tsx` — `Textarea`.
- Prefixed/suffixed controls use `InputGroup`; the wrapper owns the border and
  focus/invalid ring while `InputGroupInput` removes its own border/ring.
  Source: `src/shared/components/shadcn-ui/input-group.tsx` —
  `InputGroup`, `InputGroupAddon`, `InputGroupInput`.
- Related radio/checkbox sets use `FieldSet`/`FieldLegend`; the milestone vote
  form applies `data-disabled` to the field and native `disabled` to the set.
  Source: `src/modules/milestone/components/milestone-vote-card.tsx` —
  `FieldSet`, `FieldLegend`, `Field`; primitive source:
  `src/shared/components/shadcn-ui/field.tsx`.
- Submit loading is composed with disabled buttons and spinner icons.
  Source: `src/modules/kyc/components/kyc-form.tsx` — submit button
  `disabled={isPending}` and `SubmitSpinner`; reusable source:
  `src/shared/components/shadcn-ui/spinner.tsx` — `Spinner`.

### Buttons

- Use the shared `Button` and its CVA variants; icon-only actions select an
  `icon-*` size. Source: `src/shared/components/sections/app-header.tsx` —
  back button `size="icon-xs"` and menu button `size="icon-sm"`.
- Icons normally inherit sizing from the button’s
  `[&_svg:not([class*='size-'])]` selector. Source:
  `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants`.
- Loading actions replace or prepend content with a spinner and set
  `disabled`. Source:
  `src/shared/lib/stellar-wallet/connect-button.tsx` — `SpinnerIcon
animate-spin`; `src/modules/distribution/components/distribute-profit-dialog.tsx`
  — pending submit action.
- Destructive actions use the `destructive` variant or destructive text in an
  outline/menu item. Source:
  `src/modules/admin/components/campaigns/admin-campaign-action-dialogs.tsx`
  — cancellation/rejection dialog actions;
  `src/shared/components/sections/user-popover.tsx` — logout button
  `text-destructive`.

### Cards

- Card composition is `Card`, `CardHeader`, `CardTitle`,
  `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`. Source:
  `src/shared/components/shadcn-ui/card.tsx` — exported primitives.
- The base card is square, clips overflow, has no filled border, uses a subtle
  1px foreground ring, 12px relaxed text, and 16px internal spacing. Source:
  `src/shared/components/shadcn-ui/card.tsx` — `Card`.
- Header layout automatically allocates a second column for `CardAction` and
  a second row for `CardDescription`. Source:
  `src/shared/components/shadcn-ui/card.tsx` — `CardHeader` classes
  `has-data-[slot=card-action]:grid-cols-[1fr_auto]` and
  `has-data-[slot=card-description]:grid-rows-[auto_auto]`.
- Titles are `font-heading text-sm font-medium`; descriptions are relaxed
  12px muted text. Source: `src/shared/components/shadcn-ui/card.tsx` —
  `CardTitle`, `CardDescription`.
- Footers add a top border and consume card spacing. Source:
  `src/shared/components/shadcn-ui/card.tsx` — `CardFooter` class
  `border-t p-(--card-spacing)`.
- Feature cards may add semantic sub-surfaces (`bg-muted/30`), progress,
  hover border, and `shadow-xs`. Source:
  `src/modules/milestone/components/milestone-card.tsx` — `MilestoneCard`.

### Modals and overlays

- `Dialog` is the standard modal primitive. It portals a low-opacity blurred
  overlay and centers content with a subtle ring. Source:
  `src/shared/components/shadcn-ui/dialog.tsx` — `DialogPortal`,
  `DialogOverlay`, `DialogContent`.
- Dialog content uses 16px padding/gap, 12px relaxed copy, square corners,
  and a default `sm:max-w-sm` cap. Source:
  `src/shared/components/shadcn-ui/dialog.tsx` — `DialogContent`.
- Every implemented feature dialog composes a title and description inside
  `DialogHeader`. Examples:
  `src/modules/admin/components/campaigns/admin-campaign-action-dialogs.tsx`
  — approve/reject/cancel dialogs;
  `src/modules/milestone/components/submit-disbursement-dialog.tsx` —
  submit-progress dialog.
- The top-right close control is a ghost `icon-sm` button with an `sr-only`
  “Close” label. Source: `src/shared/components/shadcn-ui/dialog.tsx` —
  `DialogContent`.
- `DialogFooter` is reserved for cancel/confirm actions; destructive and
  pending states disable relevant controls. Source:
  `src/modules/admin/components/kyc/admin-kyc-action-dialogs.tsx` —
  approve/reject/revoke dialogs.
- `AlertDialog` is available for explicit confirmation semantics, while
  `Sheet` is used for the mobile sidebar and `Drawer` is available for
  directional mobile panels. Primitive sources:
  `src/shared/components/shadcn-ui/alert-dialog.tsx`,
  `src/shared/components/shadcn-ui/sheet.tsx`,
  `src/shared/components/shadcn-ui/drawer.tsx`; mobile usage:
  `src/shared/components/shadcn-ui/sidebar.tsx` — `isMobile` sheet branch.
- Popovers, selects, dropdowns, and context menus share a square
  `bg-popover text-popover-foreground shadow-md ring-1
ring-foreground/10` floating-surface treatment. Sources:
  `src/shared/components/shadcn-ui/popover.tsx`,
  `src/shared/components/shadcn-ui/select.tsx`,
  `src/shared/components/shadcn-ui/dropdown-menu.tsx`,
  `src/shared/components/shadcn-ui/context-menu.tsx`.

### Tables

- The shared table is 12px text, full width, caption-bottom, and always wrapped
  in horizontal overflow. Source:
  `src/shared/components/shadcn-ui/table.tsx` — `Table` classes
  `w-full caption-bottom text-xs` and container `overflow-x-auto`.
- Headers are 40px high, medium weight, left aligned, and non-wrapping;
  cells have 8px padding and are also non-wrapping. Source:
  `src/shared/components/shadcn-ui/table.tsx` — `TableHead`, `TableCell`.
- Rows use a bottom border, a muted 50% hover, and the same muted fill for
  expanded/selected state. Source:
  `src/shared/components/shadcn-ui/table.tsx` — `TableRow`.
- Numeric/address/transaction data frequently uses `font-mono text-xs`;
  primary values use `font-medium`. Source:
  `src/modules/admin/components/kyc/admin-kyc-table.tsx` — wallet cell;
  `src/modules/investment/components/investment-history-page.tsx` —
  amount and transaction cells.
- Row-level actions are placed in a narrow trailing column and opened with an
  icon button/menu whose accessible label is visually hidden. Source:
  `src/modules/admin/components/campaigns/admin-campaigns-table.tsx` —
  final `TableHead className="w-[80px]"` and `sr-only` “Open menu”.
- Responsive tables hide lower-priority columns rather than converting every
  row to a card. Source:
  `src/modules/holdings/components/holdings-table.tsx` —
  `hidden md:table-cell` and `hidden lg:table-cell`.
- Empty/error/loading states are generally rendered outside the table using
  `Empty`, `Alert`, or skeleton rows. Sources:
  `src/modules/investment/components/investment-history-page.tsx` —
  state branches; `src/modules/holdings/components/holdings-skeleton.tsx`.

### Navigation

- Public navigation uses a 64px header, centered `max-w-7xl` content, the
  Creon logo, inline links from `md`, and wallet/dashboard actions. Source:
  `src/app/(public)/page.tsx` — header classes `h-16 max-w-7xl`,
  nav `hidden md:flex`.
- Portal navigation uses a persistent/collapsible desktop sidebar and mobile
  sheet plus a sticky app header. Composition source:
  `src/app/investor/layout.tsx`, `src/app/admin/layout.tsx`, and
  `src/app/entrepreneur/[campaignId]/layout.tsx` — `SidebarProvider`,
  sidebar, `SidebarInset`, header, `AppContainer`.
- Sidebar navigation is data-driven through icon/title/href constants.
  Sources: `src/shared/constants/nav-investor.ts`,
  `src/shared/constants/nav-entrepreneur.ts`,
  `src/shared/constants/nav-admin.ts`.
- Active sidebar links use a filled Phosphor icon, sidebar accent fill, accent
  text, and medium weight. Source:
  `src/shared/components/sections/sidebar/app-sidebar.tsx` —
  `isActive`, `weight={isActive ? "fill" : "regular"}`, conditional
  `font-medium`; primitive source:
  `src/shared/components/shadcn-ui/sidebar.tsx` —
  `data-active:bg-sidebar-accent`.
- Collapsed navigation hides labels and presents right-aligned tooltips; mobile
  tooltips are suppressed. Source:
  `src/shared/components/shadcn-ui/sidebar.tsx` —
  `SidebarMenuButton`, `hidden={state !== "collapsed" || isMobile}`.
- Breadcrumbs are muted 12px flex rows with a foreground current page and
  collapse to first/ellipsis/last-two when more than three items. Source:
  `src/shared/components/shadcn-ui/breadcrumb.tsx` — `BreadcrumbList`,
  `BreadcrumbPage`; `src/shared/components/blocks/composed-breadcrumb.tsx`
  — `shouldCollapse` and `visibleItems`.

## 8. Animation and transition conventions

Tailwind’s default transition is 150ms with
`cubic-bezier(0.4, 0, 0.2, 1)`. Dependency source:
`node_modules/tailwindcss/theme.css` — `--default-transition-duration`,
`--default-transition-timing-function`.

| Pattern                    | Behavior                                                                                                                                          | Exact source                                                                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Control color transitions  | Buttons, toggles, badges use `transition-all`; inputs, rows, status badges, and links generally use `transition-colors`.                          | `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants`; `src/shared/components/shadcn-ui/input.tsx` — `Input`; `src/shared/components/shadcn-ui/table.tsx` — `TableRow`; `src/modules/proposal/components/status-badge.tsx` — base variants                                     |
| Press feedback             | Non-popup buttons move down 1px when active.                                                                                                      | `src/shared/components/shadcn-ui/button.tsx` — `active:not-aria-[haspopup]:translate-y-px`                                                                                                                                                                                               |
| Standard floating surfaces | Popover/select/menu content uses 100ms `fade-in-0 + zoom-in-95` on open, reversed on close, plus a 2-step directional slide.                      | `src/shared/components/shadcn-ui/popover.tsx` — `PopoverContent`; `src/shared/components/shadcn-ui/select.tsx` — `SelectContent`; `src/shared/components/shadcn-ui/dropdown-menu.tsx` — `DropdownMenuContent`; `src/shared/components/shadcn-ui/context-menu.tsx` — `ContextMenuContent` |
| Trigger-aligned select     | A select aligned directly to its trigger disables the standard enter/exit animation.                                                              | `src/shared/components/shadcn-ui/select.tsx` — `SelectContent` class `data-[align-trigger=true]:animate-none`                                                                                                                                                                            |
| Dialogs                    | Overlay fades over 100ms; content fades and scales from/to 95%.                                                                                   | `src/shared/components/shadcn-ui/dialog.tsx` — `DialogOverlay`, `DialogContent`                                                                                                                                                                                                          |
| Sheets                     | 200ms `ease-in-out`; fade plus 10-step directional slide on open/close.                                                                           | `src/shared/components/shadcn-ui/sheet.tsx` — `SheetContent`                                                                                                                                                                                                                             |
| Navigation menus           | Directional content slides by 52 spacing units with custom `cubic-bezier(0.22,1,0.36,1)` and a 300ms non-viewport mode; caret rotates over 300ms. | `src/shared/components/shadcn-ui/navigation-menu.tsx` — `NavigationMenuContent`, `CaretDownIcon`                                                                                                                                                                                         |
| Sidebar                    | Width and position animate over 200ms with `ease-linear`; group labels animate margin/opacity.                                                    | `src/shared/components/shadcn-ui/sidebar.tsx` — `Sidebar` gap/container and `SidebarGroupLabel`                                                                                                                                                                                          |
| Accordion                  | Height uses `animate-accordion-down` / `animate-accordion-up`, supplied by `tw-animate-css`.                                                      | `src/shared/components/shadcn-ui/accordion.tsx` — `AccordionContent`; dependency `node_modules/tw-animate-css/dist/tw-animate.css`                                                                                                                                                       |
| Progress                   | Indicator width/transform changes use `transition-all`.                                                                                           | `src/shared/components/shadcn-ui/progress.tsx` — progress indicator                                                                                                                                                                                                                      |
| Loading                    | Reusable spinner and pending icons use `animate-spin` (1s linear infinite); skeletons use `animate-pulse` (2s infinite).                          | `src/shared/components/shadcn-ui/spinner.tsx` — `animate-spin`; `src/shared/components/shadcn-ui/skeleton.tsx` — `animate-pulse`; dependency values in `node_modules/tailwindcss/theme.css` — `--animate-spin`, `--animate-pulse`                                                        |
| OTP caret                  | The active one-time-password slot displays a blinking 1px caret using the dependency’s 1.25s caret animation.                                     | `src/shared/components/shadcn-ui/input-otp.tsx` — caret class `animate-caret-blink`; `node_modules/tw-animate-css/dist/tw-animate.css` — `--animate-caret-blink`                                                                                                                         |
| Live status                | Approved proposal dot uses `animate-ping` (1s infinite).                                                                                          | `src/modules/proposal/components/status-badge.tsx` — ripple `animate-ping`; dependency `--animate-ping`                                                                                                                                                                                  |
| Upload feedback            | Submit-progress upload icon uses `animate-bounce`.                                                                                                | `src/modules/milestone/components/submit-disbursement-dialog.tsx` — `UploadIcon animate-bounce`                                                                                                                                                                                          |
| Card media hover           | Proposal image scales to 105% and dims to 90% over 200ms.                                                                                         | `src/modules/proposal/components/proposal-card.tsx` — image classes `transition-transform duration-200 group-hover:scale-105 group-hover:brightness-90`                                                                                                                                  |
| Theme changes              | Theme swaps disable CSS transitions to prevent cross-theme animation.                                                                             | `src/shared/components/provider/theme-provider.tsx` — `disableTransitionOnChange`                                                                                                                                                                                                        |

No `motion-reduce:*` or `motion-safe:*` utilities are applied to the recurring
spin, pulse, ping, bounce, overlay, or navigation animations. Representative
sources: `src/shared/components/shadcn-ui/spinner.tsx` — `animate-spin`;
`src/shared/components/shadcn-ui/skeleton.tsx` — `animate-pulse`;
`src/modules/proposal/components/status-badge.tsx` — `animate-ping`;
`src/shared/components/shadcn-ui/dialog.tsx` — open/close animations.

## 9. Icons, fonts, and reusable assets

### Icons

- Phosphor is the configured and installed icon library. Source:
  `components.json` — `"iconLibrary": "phosphor"`; `package.json` —
  `@phosphor-icons/react: ^2.1.10`.
- Client components import from `@phosphor-icons/react`; some server-safe nav
  constants import from `@phosphor-icons/react/dist/ssr`. Sources:
  `src/shared/constants/nav-investor.ts`,
  `src/shared/constants/nav-entrepreneur.ts`, and
  `src/shared/constants/nav-admin.ts`.
- Most primitives normalize un-sized icons to 16px using
  `[&_svg:not([class*='size-'])]:size-4`; compact variants reduce them to
  12px or 14px. Source:
  `src/shared/components/shadcn-ui/button.tsx` — `buttonVariants`;
  `src/shared/components/shadcn-ui/select.tsx` — `SelectTrigger` and
  `SelectItem`.
- Active sidebar icons change Phosphor weight from `regular` to `fill`.
  Source: `src/shared/components/sections/sidebar/app-sidebar.tsx` —
  `<item.icon weight={isActive ? "fill" : "regular"} />`.
- Status toasts use dedicated Phosphor icons for success, info, warning,
  error, and loading. Source:
  `src/shared/components/shadcn-ui/sonner.tsx` — `Toaster.icons`.
- Decorative icons are commonly marked `aria-hidden`; icon-only buttons add
  an `sr-only` label or `aria-label`. Sources:
  `src/modules/faucet/components/faucet-page.tsx` — decorative icons;
  `src/shared/components/shadcn-ui/sidebar.tsx` — `SidebarTrigger`;
  `src/modules/admin/components/campaigns/admin-campaigns-table.tsx` —
  menu trigger.

### Reusable vector and raster assets

| Asset                      | Convention                                                                                        | Exact source                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Creon app icon/favicon     | 93×93 SVG, 16px framed radius, dark `#171717` field with white mark.                              | `src/app/icon.svg` — root `<svg>`, `<rect rx="16" fill="#171717">`                      |
| Logo icon                  | 64×64 black and white SVG variants.                                                               | `public/logo-icon.svg`, `public/logo-icon-white.svg`                                    |
| Framed logo icon           | 93×93 black/white inverse variants with 16px SVG frame radius.                                    | `public/logo-icon-framed.svg`, `public/logo-icon-framed-white.svg`                      |
| Full logo lockup           | 175×59 black and 173×59 white SVG variants.                                                       | `public/logo-text.svg`, `public/logo-text-white.svg`                                    |
| Creon wordmark             | 117×33 black and white SVG variants.                                                              | `public/creon-text.svg`, `public/creon-text-white.svg`                                  |
| Stellar logo file          | Raw Stellar mark with `viewBox="0 0 236.36 200"`.                                                 | `public/stellar-logo.svg`                                                               |
| Reusable Stellar component | Inline SVG that defaults to semantic `fill-foreground` and accepts merged classes.                | `src/shared/assets/stellar-logo.tsx` — `StellarLogo`                                    |
| USDC icon                  | Inline current-color SVG, `0.88em × 1em`, inheriting foreground color.                            | `src/shared/assets/usdc-outline.tsx` — `OutlineUSDC`, `fill="currentColor"`             |
| Empty-state illustration   | Layered neutral cards, semantic fills/borders, `shadow-sm`, and hidden from assistive technology. | `src/shared/assets/stacked-card.tsx` — `StackedCardsIllustration`, `aria-hidden="true"` |
| Social preview             | Raster Open Graph image.                                                                          | `public/opengraph-image.jpg`                                                            |
| Temporary campaign image   | WebP sample asset.                                                                                | `public/temp/kopi-online.webp`                                                          |

The portal sidebar uses `/logo-icon.svg`, adds `dark:invert`, and pairs it with
a text “Creon” label that disappears in icon-collapse mode. Source:
`src/shared/components/sections/sidebar/app-sidebar.tsx` —
`AppSidebarLogo`.

The reusable image fallback replaces missing images with a muted surface and
Phosphor broken-image icon, while exposing `role="img"` and the label “Image
failed to load.” Source:
`src/shared/components/primitives/image-with-fallback.tsx` —
`ImageWithFallback`.

## 10. Accessibility conventions

### Implemented patterns

| Convention                                                                                                                                                    | Exact source                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The document language is English.                                                                                                                             | `src/app/layout.tsx` — `<html lang="en">`                                                                                                                                                                                                                                                                                                                                                          |
| Interactive primitives use visible keyboard focus through semantic ring/border utilities, generally without displaying focus styling for pointer interaction. | `src/shared/components/shadcn-ui/button.tsx` — `focus-visible:*`; `src/shared/components/shadcn-ui/input.tsx` — `Input` `focus-visible:*`; `src/shared/components/shadcn-ui/select.tsx` — `SelectTrigger` `focus-visible:*`; `src/shared/components/shadcn-ui/checkbox.tsx` — `Checkbox` `focus-visible:*`; `src/shared/components/shadcn-ui/radio-group.tsx` — `RadioGroupItem` `focus-visible:*` |
| Disabled controls suppress pointer events or use a not-allowed cursor and reduce opacity to 50%.                                                              | `src/shared/components/shadcn-ui/button.tsx` — `disabled:pointer-events-none disabled:opacity-50`; `src/shared/components/shadcn-ui/input.tsx` — `disabled:cursor-not-allowed disabled:opacity-50`                                                                                                                                                                                                 |
| Checkbox, radio, and switch controls expand their effective pointer target with an absolutely positioned pseudo-element.                                      | `src/shared/components/shadcn-ui/checkbox.tsx` — `Checkbox` class `after:absolute after:-inset-x-3 after:-inset-y-2`; `src/shared/components/shadcn-ui/radio-group.tsx` — `RadioGroupItem` same class; `src/shared/components/shadcn-ui/switch.tsx` — `Switch` same class                                                                                                                          |
| Form labels use `htmlFor`; invalid controls expose `aria-invalid`; field errors use `role="alert"` and are often `aria-live="polite"`.                        | `src/modules/kyc/components/kyc-form.tsx` — labeled fields and `FieldError aria-live="polite"`; `src/shared/components/shadcn-ui/field.tsx` — `FieldError role="alert"`                                                                                                                                                                                                                            |
| Submit controls expose busy state.                                                                                                                            | `src/modules/kyc/components/kyc-form.tsx` — submit `aria-busy={isPending}`; `src/modules/auth/components/register-form.tsx` — submit `aria-busy={isPending}`                                                                                                                                                                                                                                       |
| High-priority form/status errors use assertive live regions.                                                                                                  | `src/modules/kyc/components/kyc-form.tsx` — `StatusBanner role="alert" aria-live="assertive"`; `src/modules/proposal/components/forms/create-proposal.tsx` — submit error region                                                                                                                                                                                                                   |
| Standard alerts always have `role="alert"`.                                                                                                                   | `src/shared/components/shadcn-ui/alert.tsx` — `Alert`                                                                                                                                                                                                                                                                                                                                              |
| Reusable spinner exposes `role="status"` and `aria-label="Loading"`.                                                                                          | `src/shared/components/shadcn-ui/spinner.tsx` — `Spinner`                                                                                                                                                                                                                                                                                                                                          |
| Dialog close buttons include visually hidden text; feature dialogs provide visible titles/descriptions.                                                       | `src/shared/components/shadcn-ui/dialog.tsx` — close `sr-only`; `src/modules/admin/components/kyc/admin-kyc-action-dialogs.tsx` — `DialogTitle`, `DialogDescription`                                                                                                                                                                                                                               |
| The mobile sidebar’s otherwise invisible sheet header includes an `sr-only` title and description.                                                            | `src/shared/components/shadcn-ui/sidebar.tsx` — mobile `SheetHeader`, `SheetTitle`, `SheetDescription`                                                                                                                                                                                                                                                                                             |
| Breadcrumbs have an accessible navigation label, current-page state, and presentational separators.                                                           | `src/shared/components/shadcn-ui/breadcrumb.tsx` — `aria-label="breadcrumb"`, `aria-current="page"`, separator `aria-hidden`                                                                                                                                                                                                                                                                       |
| Pagination has navigation and control labels plus `aria-current` for the active page.                                                                         | `src/shared/components/shadcn-ui/pagination.tsx` — `Pagination`, `PaginationLink`, previous/next controls                                                                                                                                                                                                                                                                                          |
| Carousel regions/slides use `aria-roledescription`, and controls have hidden previous/next labels.                                                            | `src/shared/components/shadcn-ui/carousel.tsx` — carousel and item roles, control `sr-only` text                                                                                                                                                                                                                                                                                                   |
| Content images generally provide descriptive alt text; the fallback has a programmatic image label.                                                           | `src/modules/campaign/components/campaign-card.tsx` — campaign image `alt`; `src/modules/campaign/components/campaign-media-gallery.tsx` — media `alt`; `src/shared/components/primitives/image-with-fallback.tsx`                                                                                                                                                                                 |
| Decorative art and icons are hidden from assistive technology.                                                                                                | `src/shared/assets/stacked-card.tsx` — `aria-hidden="true"`; `src/modules/faucet/components/faucet-page.tsx` — decorative icon `aria-hidden`                                                                                                                                                                                                                                                       |
| The sidebar can be toggled with `Ctrl+B`/`Cmd+B`, and its state persists in a `SameSite=Lax` cookie.                                                          | `src/shared/components/shadcn-ui/sidebar.tsx` — `SIDEBAR_KEYBOARD_SHORTCUT`, key handler, `SIDEBAR_COOKIE_NAME`                                                                                                                                                                                                                                                                                    |
| Theme hotkey handling ignores Meta/Ctrl/Alt shortcuts, repeats, editable content, inputs, textareas, and selects.                                             | `src/shared/components/provider/theme-provider.tsx` — `isTypingTarget`, `ThemeHotkey.onKeyDown`                                                                                                                                                                                                                                                                                                    |
| Default tooltips open without delay.                                                                                                                          | `src/shared/components/shadcn-ui/tooltip.tsx` — `TooltipProvider delayDuration = 0`                                                                                                                                                                                                                                                                                                                |

### Observed accessibility gaps and risks

These are source observations, not changes made by this guide.

- Recurring and overlay animations do not include reduced-motion variants.
  Sources: `src/shared/components/shadcn-ui/spinner.tsx` — `animate-spin`;
  `src/shared/components/shadcn-ui/skeleton.tsx` — `animate-pulse`;
  `src/shared/components/shadcn-ui/dialog.tsx` — open/close animation classes;
  `src/modules/proposal/components/status-badge.tsx` — `animate-ping`.
- Default buttons and inputs are 32px high, with smaller 24px and 28px button
  variants. They do not meet a 44px touch target by visual box alone.
  Source: `src/shared/components/shadcn-ui/button.tsx` —
  `buttonVariants.size` (`h-6`, `h-7`, `h-8`, `h-9`);
  `src/shared/components/shadcn-ui/input.tsx` — `h-8`.
- The raw clear button in the shared search input has only an icon and no
  `aria-label` or hidden text. Source:
  `src/shared/components/blocks/search-input.tsx` — clear `<button>` with
  `<XIcon>`.
- Registration role cards implement `role="radio"` and are contained in a
  `role="radiogroup"`, but each option is a button and no arrow-key radio-group
  navigation is implemented in `RoleCard`. Source:
  `src/modules/auth/components/register-form.tsx` — `RoleCard`,
  `role="radiogroup"`.
- Field errors are visually and live-region exposed, but the shared field
  primitive does not automatically generate `aria-describedby` links between
  controls, descriptions, and errors. Source:
  `src/shared/components/shadcn-ui/field.tsx` — `FieldDescription` and
  `FieldError`; project form controls provide `aria-invalid` but no shared
  description/error ID wiring.
- Much of the application UI uses 12px (`text-xs`) text, including buttons,
  form controls, tables, dialogs, and navigation primitives. Sources:
  `src/shared/components/shadcn-ui/button.tsx`,
  `src/shared/components/shadcn-ui/input.tsx`,
  `src/shared/components/shadcn-ui/table.tsx`,
  `src/shared/components/shadcn-ui/dialog.tsx`, and
  `src/shared/components/shadcn-ui/navigation-menu.tsx`.

## Source-of-truth order

When an implementation appears to conflict with this guide, use this order:

1. `src/app/globals.css` for project tokens, dark-mode values, base styles,
   radius aliases, and scrollbar treatment.
2. `src/app/layout.tsx` for loaded font families and global providers.
3. `components.json` for the shadcn preset, icon library, aliases, and Tailwind
   CSS entry point.
4. `src/shared/components/shadcn-ui/*` for primitive geometry, variants, and
   interaction states.
5. `src/shared/components/primitives/*`, `layouts/*`, `sections/*`, and
   `blocks/*` for shared composed conventions.
6. `src/modules/*` and `src/app/*` for feature-level usage, responsive
   composition, and deliberate or accidental exceptions.
7. `node_modules/tailwindcss/theme.css` and
   `node_modules/tw-animate-css/dist/tw-animate.css` for dependency defaults
   referenced by project utilities; versions are fixed by `package.json` and
   `pnpm-lock.yaml`.
