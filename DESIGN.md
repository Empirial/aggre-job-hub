# Design

## Color

Strategy: **Committed** — brand orange carries the primary interactive layer; charcoal anchors structure.

| Token | Value | Usage |
|---|---|---|
| Brand Orange | `#F7941D` / `oklch(72% 0.17 52)` | Primary buttons, active states, key icons, ATS score badges |
| Brand Dark | `#3D3D3D` / `oklch(28% 0 0)` | Headings, sidebar structure, logo mark |
| Surface | `#F0F2F5` / `oklch(96% 0.005 250)` | App background |
| Card | `#FFFFFF` | Card backgrounds |
| Border | `#E5E7EB` | Subtle dividers, card edges |
| Text Primary | `#111827` | Body text, table cells |
| Text Muted | `#6B7280` | Labels, secondary info, empty states |
| Success | `#059669` | Sent/Interview status, CV generated |
| Warning | `#D97706` | Pending status |
| Danger | `#DC2626` | Rejected status, errors |
| Brand Tint | `#FEF3E2` | Badge backgrounds, hover tints for orange elements |

Never use pure `#000` or `#fff`. Tint neutrals toward the brand hue.

## Typography

Font stack: System UI — `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. No external font dependency (data-conscious users).

| Role | Size | Weight | Usage |
|---|---|---|---|
| Page title | 20px / 1.25rem | 600 | Section headings (Overview, Jobs Board) |
| Card title | 14px / 0.875rem | 500 | Card section headings |
| Body | 14px / 0.875rem | 400 | Table cells, descriptions |
| Label | 12px / 0.75rem | 500 | Form labels, column headers |
| Caption | 11px / 0.6875rem | 400 | Timestamps, meta info |

Line height: 1.5 for body, 1.2 for headings. Max line length 70ch.

## Elevation

Three levels only. No deep shadow stacks.

| Level | Value | Usage |
|---|---|---|
| Flat | none | Sidebar nav items, inline elements |
| Raised | `0 1px 3px rgba(0,0,0,0.06)` | Cards, panels |
| Float | `0 4px 12px rgba(0,0,0,0.08)` | Dropdowns, popovers |

## Spacing

Base unit: 4px. Common values: 4, 8, 12, 16, 20, 24, 32, 40. Vary intentionally for rhythm — equal padding everywhere is monotony.

## Components

**Sidebar**: 224px wide on desktop. White background, 1px right border `#F3F4F6`. Active nav item: `bg-brand-50 text-brand-600 font-medium`. Logo: actual CareerGate logo image at `h-9`.

**Buttons**:
- Primary: `bg-[#F7941D] hover:bg-[#E08518] text-white` — actions like "Run Scraper", "Generate CV", "Download"
- Secondary/Outline: `border border-gray-200 text-gray-700 hover:bg-gray-50`
- Ghost: `text-gray-500 hover:text-gray-900 hover:bg-gray-50`
- Danger: `bg-red-600 hover:bg-red-700 text-white` — destructive only

**Badges / Status**:
- Interview: `bg-emerald-50 text-emerald-600`
- Sent: `bg-blue-50 text-blue-600`
- Pending: `bg-amber-50 text-amber-600`
- Rejected: `bg-red-50 text-red-500`
- ATS score: `bg-brand-50 text-brand-600`

**Tables**: `w-full`, `border-b border-gray-50` between rows, `hover:bg-gray-50` on row hover. Column headers: `text-xs font-medium text-gray-400 uppercase tracking-wide`.

**Cards**: `border-0 shadow-sm rounded-xl`. No nested cards. No colored left-border accents.

**Forms**: Labels `text-xs text-gray-500`. Inputs `border-gray-200 text-sm h-9`. Focus ring uses brand orange.

## Motion

Minimal. Transitions max 200ms, `ease-out`. Sidebar mobile drawer: `transition-transform duration-200`. Loading spinners on async operations. No bounce, no elastic, no layout property animation.

## Layout

Dashboard shell: sidebar (224px) + main scroll area. Background `#F0F2F5`. Content padding `p-6`. Max content width uncapped — fill the available space. Responsive breakpoint at `lg` (1024px) for sidebar visibility and grid columns.
